export function Footer() {
  return (
    <footer className="border-t bg-white py-4 text-center text-sm text-slate-600">
      <div className="container mx-auto px-4">
        <p className="mb-2">Copyright © 2025 PMCare</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <a href="#" className="hover:text-sky-600 hover:underline">
            Disclaimer
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-sky-600 hover:underline">
            Privacy Policy
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-sky-600 hover:underline">
            Security Policy
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-sky-600 hover:underline">
            Personal Data Protection
          </a>
        </div>
      </div>
    </footer>
  )
}
