import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home.jsx'
import AppHome from './pages/AppHome.jsx'
import Signup from './pages/auth/Signup.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import Login from './pages/auth/Login.jsx'
import RequestOTP from './pages/auth/RequestOTP.jsx'
import LoginOTP from './pages/auth/LoginOTP.jsx'
import { setAuthToken } from './lib/apiClient.js'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import Profile from './pages/Profile.jsx'
import PostsList from './pages/posts/PostsList.jsx'
import NewPost from './pages/posts/NewPost.jsx'
import MyPosts from './pages/posts/MyPosts.jsx'
import PostDetail from './pages/posts/PostDetail.jsx'
import EditPost from './pages/posts/EditPost.jsx'
import NewClaim from './pages/claims/NewClaim.jsx'
import ClaimContact from './pages/claims/ClaimContact.jsx'
import ClaimDetail from './pages/claims/ClaimDetail.jsx'
import PostClaims from './pages/claims/PostClaims.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import PublicProfile from './pages/PublicProfile.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/home', element: <ProtectedRoute><AppHome /></ProtectedRoute> },
      { path: '/auth/signup', element: <Signup /> },
      { path: '/auth/verify', element: <VerifyEmail /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/request-otp', element: <RequestOTP /> },
      { path: '/auth/login-otp/verify', element: <LoginOTP /> },
      { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: '/users/:id', element: <PublicProfile /> },
      { path: '/posts', element: <ProtectedRoute><PostsList /></ProtectedRoute> },
      { path: '/posts/new', element: <ProtectedRoute><NewPost /></ProtectedRoute> },
      { path: '/posts/mine', element: <ProtectedRoute><MyPosts /></ProtectedRoute> },
      { path: '/posts/:id', element: <ProtectedRoute><PostDetail /></ProtectedRoute> },
      { path: '/posts/:id/edit', element: <ProtectedRoute><EditPost /></ProtectedRoute> },
      { path: '/claims/:id/new', element: <ProtectedRoute><NewClaim /></ProtectedRoute> },
      { path: '/claims/:id/contact', element: <ProtectedRoute><ClaimContact /></ProtectedRoute> },
      { path: '/claims/:id', element: <ProtectedRoute><ClaimDetail /></ProtectedRoute> },
      { path: '/posts/:id/claims', element: <ProtectedRoute><PostClaims /></ProtectedRoute> },
      { path: '/admin', element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> }
    ]
  }
])

const queryClient = new QueryClient()

// Ensure Axios has Authorization on boot if a token exists
const token = (() => {
  try {
    const persisted = JSON.parse(localStorage.getItem('fms-auth'))
    return persisted?.state?.accessToken || null
  } catch {
    return null
  }
})()
if (token) setAuthToken(token)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
