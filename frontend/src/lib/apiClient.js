import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  withCredentials: false
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Lightweight refresh token handling using the persisted auth in localStorage
let isRefreshing = false;
let pendingRequests = [];

function getPersistedAuth() {
  try {
    const persisted = JSON.parse(localStorage.getItem('fms-auth'));
    return persisted?.state || null;
  } catch {
    return null;
  }
}

function setPersistedAccessToken(newAccessToken) {
  try {
    const persisted = JSON.parse(localStorage.getItem('fms-auth')) || {};
    const next = {
      ...persisted,
      state: {
        ...(persisted.state || {}),
        accessToken: newAccessToken,
        isAuthenticated: !!newAccessToken
      }
    };
    localStorage.setItem('fms-auth', JSON.stringify(next));
  } catch {
    // noop
  }
}

async function refreshAccessToken() {
  const persisted = getPersistedAuth();
  const refreshToken = persisted?.refreshToken;
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await api.post('/v1/auth/token', { refreshToken });
  const newAccessToken = data?.accessToken;
  if (!newAccessToken) throw new Error('No access token in refresh');
  setPersistedAccessToken(newAccessToken);
  setAuthToken(newAccessToken);
  return newAccessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    if (status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${token}` };
            originalRequest._retry = true;
            return api.request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        pendingRequests.forEach(({ resolve }) => resolve(token));
        pendingRequests = [];
        originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${token}` };
        return api.request(originalRequest);
      } catch (err) {
        pendingRequests.forEach(({ reject }) => reject(err));
        pendingRequests = [];
        // On refresh failure, clear auth
        setPersistedAccessToken(null);
        setAuthToken(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);


