import { Activity, Gauge, Shield, Zap } from 'lucide-react'
import React from 'react'
import type { VehicleSpecifications } from '../../types/configurator'

interface VehicleSpecsPanelProps {
  specs: VehicleSpecifications
}

export const VehicleSpecsPanel: React.FC<VehicleSpecsPanelProps> = ({ specs }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Performance Specs</span>
        <span className="text-xs text-blue-400 font-medium">Factory Official</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Max Power
          </div>
          <div className="text-lg font-bold text-zinc-100">{specs.power_hp} <span className="text-xs font-normal text-zinc-400">HP</span></div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> 0 - 60 mph
          </div>
          <div className="text-lg font-bold text-zinc-100">{specs.acceleration_0_60_mph} <span className="text-xs font-normal text-zinc-400">sec</span></div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Gauge className="w-3.5 h-3.5 text-rose-400" /> Top Speed
          </div>
          <div className="text-lg font-bold text-zinc-100">{specs.top_speed_mph} <span className="text-xs font-normal text-zinc-400">mph</span></div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Shield className="w-3.5 h-3.5 text-blue-400" /> Drivetrain
          </div>
          <div className="text-xs font-semibold text-zinc-100 truncate">{specs.drivetrain}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs">
        <div className="flex justify-between text-zinc-400">
          <span>Engine</span>
          <span className="font-medium text-zinc-200">{specs.engine}</span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Transmission</span>
          <span className="font-medium text-zinc-200">{specs.transmission}</span>
        </div>
      </div>
    </div>
  )
}
