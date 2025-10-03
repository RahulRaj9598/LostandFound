import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: ({ token, refreshToken, user }) => set({ accessToken: token, refreshToken, user, isAuthenticated: !!token }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
      setUser: (user) => set({ user })
    }),
    { name: 'fms-auth' }
  )
)


