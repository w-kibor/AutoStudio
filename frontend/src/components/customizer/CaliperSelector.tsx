import { Check } from 'lucide-react'
import React from 'react'
import type { CaliperProperties, CustomizationOption } from '../../types/configurator'

interface CaliperSelectorProps {
  options: CustomizationOption[]
  selectedCode: string
  onSelect: (option: CustomizationOption) => void
}

export const CaliperSelector: React.FC<CaliperSelectorProps> = ({ options, selectedCode, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Brake Caliper Finish</span>
        <span className="text-xs text-zinc-400">High-Performance Brakes</span>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const props = option.properties as CaliperProperties
          const isSelected = option.code === selectedCode

          return (
            <button
              key={option.code}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-zinc-800/80 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                  style={{ backgroundColor: props.hex }}
                />
                <div>
                  <h4 className="text-xs font-semibold text-zinc-100">{option.name}</h4>
                  <p className="text-[11px] text-zinc-400">Anodized Heat-Resistant Coating</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-300">
                  {option.price_delta === 0 ? 'Included' : `+$${option.price_delta.toLocaleString()}`}
                </span>
                {isSelected && <Check className="w-4 h-4 text-blue-400" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
