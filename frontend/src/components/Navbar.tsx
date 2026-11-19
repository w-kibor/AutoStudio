import { Car, Layers, Sliders } from 'lucide-react'
import React from 'react'

interface NavbarProps {
  currentVehicleName: string
  manufacturerName: string
}

export const Navbar: React.FC<NavbarProps> = ({ currentVehicleName, manufacturerName }) => {
  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">AutoStudio</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                3D Configurator
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Interactive Automotive Studio</p>
          </div>
        </div>

        {/* Current Vehicle Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
          <span className="text-zinc-400">{manufacturerName}</span>
          <span className="text-zinc-600">•</span>
          <span className="font-semibold text-zinc-200">{currentVehicleName}</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href="#catalogue"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden md:inline">Catalogue</span>
          </a>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md shadow-blue-500/20 transition-all">
            <Sliders className="w-3.5 h-3.5" />
            <span>Studio Mode</span>
          </button>
        </div>
      </div>
    </header>
  )
}
