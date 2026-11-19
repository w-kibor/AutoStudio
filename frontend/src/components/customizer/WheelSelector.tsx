import { Check } from 'lucide-react'
import React from 'react'
import type { CustomizationOption, WheelProperties } from '../../types/configurator'

interface WheelSelectorProps {
  options: CustomizationOption[]
  selectedCode: string
  onSelect: (option: CustomizationOption) => void
}

export const WheelSelector: React.FC<WheelSelectorProps> = ({ options, selectedCode, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Selected Design</span>
        <span className="text-xs text-zinc-400">Forged Alloy Rims</span>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const props = option.properties as WheelProperties
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
                {/* Visual Wheel Swatch Icon */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-zinc-600/60 shadow-inner"
                  style={{ backgroundColor: props.color_hex }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-500" />
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-100">{option.name}</h4>
                  <p className="text-[11px] text-zinc-400 capitalize">
                    {props.finish.replace('_', ' ')} • {props.spoke_count} Spokes
                  </p>
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
