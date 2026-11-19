import React from 'react'
import type { VehicleSpecifications } from '../../types/configurator'

interface VehicleSpecsPanelProps {
  specs: VehicleSpecifications
}

export const VehicleSpecsPanel: React.FC<VehicleSpecsPanelProps> = ({ specs }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
          Technical Data
        </span>
        <span className="text-[11px] text-zinc-400">Factory Spec</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 bg-zinc-950 border border-white/10">
          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Output</span>
          <div className="text-xl font-serif font-medium text-white mt-1">
            {specs.power_hp} <span className="text-xs font-sans text-zinc-400">HP</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-950 border border-white/10">
          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">0–60 mph</span>
          <div className="text-xl font-serif font-medium text-white mt-1">
            {specs.acceleration_0_60_mph}{' '}
            <span className="text-xs font-sans text-zinc-400">sec</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-950 border border-white/10">
          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Top Speed</span>
          <div className="text-xl font-serif font-medium text-white mt-1">
            {specs.top_speed_mph} <span className="text-xs font-sans text-zinc-400">mph</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-950 border border-white/10">
          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Torque</span>
          <div className="text-xl font-serif font-medium text-white mt-1">
            {specs.torque_lb_ft ?? '—'} <span className="text-xs font-sans text-zinc-400">lb-ft</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-white/10 divide-y divide-white/10 text-xs">
        <div className="flex justify-between p-3">
          <span className="text-zinc-500">Powertrain</span>
          <span className="font-medium text-zinc-200 text-right">{specs.engine}</span>
        </div>
        <div className="flex justify-between p-3">
          <span className="text-zinc-500">Drivetrain</span>
          <span className="font-medium text-zinc-200 text-right">{specs.drivetrain}</span>
        </div>
        <div className="flex justify-between p-3">
          <span className="text-zinc-500">Transmission</span>
          <span className="font-medium text-zinc-200 text-right">{specs.transmission}</span>
        </div>
      </div>
    </div>
  )
}
