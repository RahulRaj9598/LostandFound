import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../stores/auth.js'
import { setAuthToken } from '../../lib/apiClient.js'
import { Search, Compass, PlusCircle, User2, LogOut, Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  function handleLogout() {
    logout()
    setAuthToken(null)
    setProfileOpen(false)
    setMobileOpen(false)
  }
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="sm:hidden p-2 rounded-md hover:bg-gray-100" aria-label="Open menu" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.svg" 
              alt="FindMyStuff Logo" 
              className="h-8 w-8" 
            />
            <span className="text-2xl font-semibold tracking-tight">FindMyStuff</span>
          </Link>
        </div>
        {!isAuthenticated ? (
          <nav className="hidden sm:flex items-center gap-3 md:gap-4 text-sm">
            <a href="#features" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2"><Search className="h-4 w-4" />Features</a>
            <a href="#how" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2"><Compass className="h-4 w-4" />How it works</a>
            <Link to="/auth/signup" className="px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-2">Sign up</Link>
            <Link to="/auth/login" className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">Sign in</Link>
          </nav>
        ) : (
          <nav className="hidden sm:flex items-center gap-3 md:gap-4 text-sm">
            <Link to="/posts?type=LOST" className="px-3 py-2 rounded-md hover:bg-gray-100 hidden sm:inline-flex items-center gap-2">
              <Search className="h-4 w-4" /> Lost
            </Link>
            <Link to="/posts?type=FOUND" className="px-3 py-2 rounded-md hover:bg-gray-100 hidden sm:inline-flex items-center gap-2">
              <Compass className="h-4 w-4" /> Found
            </Link>
            <Link to="/posts/mine" className="px-3 py-2 rounded-md hover:bg-gray-100 hidden sm:inline">My Posts</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-gray-100 hidden sm:inline">Admin</Link>
            )}
            <div className="relative">
              <button className="flex items-center gap-2 hover:opacity-90 px-2 py-1 rounded-md" onClick={() => setProfileOpen(v => !v)}>
              {user?.profile?.avatarUrl ? (
                <img src={user.profile.avatarUrl} alt="avatar" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gray-200 grid place-items-center text-gray-500">
                  <User2 className="h-5 w-5" />
                </div>
              )}
                <span className="hidden sm:inline font-medium">{user?.profile?.name || user?.email || 'Profile'}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-md p-2 text-sm">
                  <div className="px-2 py-1.5">
                    <div className="text-xs text-gray-50 bg-blue-500 px-2 py-1 rounded-sm">{user?.email}</div>
                  </div>
                  <div className="my-1 border-t" />
                  <Link onClick={() => setProfileOpen(false)} to="/profile" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-blue-400">
                    <User2 className="h-4 w-4" /> Profile
                  </Link>
                  <Link onClick={() => setProfileOpen(false)} to="/posts/new" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-green-400 ">
                    <PlusCircle className="h-4 w-4" /> Create Post
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-2 py-2 rounded-md hover:bg-red-500 text-left">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 text-sm">
            {!isAuthenticated ? (
              <>
                <a href="#features" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2"><Search className="h-4 w-4" />Features</a>
                <a href="#how" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2"><Compass className="h-4 w-4" />How it works</a>
                <Link onClick={() => setMobileOpen(false)} to="/auth/signup" className="px-3 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 inline-flex items-center gap-2">Sign up</Link>
                <Link onClick={() => setMobileOpen(false)} to="/auth/login" className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">Sign in</Link>
              </>
            ) : (
              <>
                <Link onClick={() => setMobileOpen(false)} to="/posts?type=LOST" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2">
                  <Search className="h-4 w-4" /> Lost
                </Link>
                <Link onClick={() => setMobileOpen(false)} to="/posts?type=FOUND" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2">
                  <Compass className="h-4 w-4" /> Found
                </Link>
                <Link onClick={() => setMobileOpen(false)} to="/posts/mine" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2">My Posts</Link>
                {user?.role === 'ADMIN' && (
                  <Link onClick={() => setMobileOpen(false)} to="/admin" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2">Admin</Link>
                )}
                <div className="my-1 border-t" />
                <Link onClick={() => { setMobileOpen(false); setProfileOpen(false) }} to="/profile" className="px-3 py-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2"><User2 className="h-4 w-4" /> Profile</Link>
                <Link onClick={() => { setMobileOpen(false); setProfileOpen(false) }} to="/posts/new" className="px-3 py-2 rounded-md hover:bg-green-500 inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Post</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-red-400 text-white hover:bg-red-500 inline-flex items-center gap-2"><LogOut className="h-4 w-4" />Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}


