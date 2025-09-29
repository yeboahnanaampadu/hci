
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="container-prose py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Republic of Guinea — E‑Visa Portal</p>
        <nav className="flex gap-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </nav>
      </div>
    </footer>
  )
}
