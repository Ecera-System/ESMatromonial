"use client"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-8 py-6 shadow-lg shadow-indigo-500/20 animate-slide-down">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-4xl font-black bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent animate-logo-glow">
          MatchMate
        </div>
        <ul className="hidden md:flex gap-8">
          {["Home", "Matches", "Messages", "Profile"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-600 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
