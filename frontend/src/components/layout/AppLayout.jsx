import { Outlet } from 'react-router-dom'
import Navbar from '../site/Navbar.jsx'
import Footer from '../site/Footer.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}


