export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <span>© {new Date().getFullYear()} FindMyStuff</span>
        <nav className="flex gap-4">
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  )
}


