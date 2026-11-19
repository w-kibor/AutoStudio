import React from 'react'

interface NavbarProps {
  currentVehicleName: string
  manufacturerName: string
  onOpenSave?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentVehicleName,
  manufacturerName,
  onOpenSave,
}) => {
  return (
    <header className="w-full border-b border-white/10 bg-black/90 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs tracking-[0.15em] uppercase text-zinc-400">
          <a href="#studio" className="text-white font-medium transition-colors">
            Configurator
          </a>
          <a href="#fleet" className="hover:text-white transition-colors">
            Models
          </a>
          <a href="#engineering" className="hover:text-white transition-colors">
            Performance
          </a>
        </nav>

        {/* Center Brand Emblem & Wordmark (Mercedes-Benz inspired) */}
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 36 36"
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="18" cy="18" r="16" />
            <path d="M18 2 L18 18 L31.8 26" />
            <path d="M18 18 L4.2 26" />
          </svg>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-[0.18em] uppercase text-white leading-none">
              AutoStudio
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-zinc-500 mt-0.5">
              Bespoke Atelier
            </span>
          </div>
        </div>

        {/* Right Active Vehicle & Save CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
            <span className="uppercase tracking-[0.15em] text-[10px] text-zinc-500">
              {manufacturerName}
            </span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 font-medium">{currentVehicleName}</span>
          </div>

          {onOpenSave && (
            <button
              onClick={onOpenSave}
              className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors"
            >
              Save Build
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
