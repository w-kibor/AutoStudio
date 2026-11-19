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
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
          Light-Alloy Wheels
        </span>
        <span className="text-[11px] text-zinc-400">Forged Design</span>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const props = option.properties as WheelProperties
          const isSelected = option.code === selectedCode

          return (
            <button
              key={option.code}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-3.5 border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-white text-white'
                  : 'bg-zinc-950/80 border-white/10 text-zinc-300 hover:border-white/30 hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-white/25 shadow-inner"
                  style={{ backgroundColor: props.color_hex }}
                >
                  <div className="w-3 h-3 rounded-full bg-black border border-zinc-500" />
                </div>

                <div>
                  <h4 className="text-xs font-medium text-white">{option.name}</h4>
                  <p className="text-[11px] text-zinc-400 capitalize mt-0.5">
                    {props.finish.replace(/_/g, ' ')} • {props.spoke_count}-Spoke
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-zinc-300">
                  {option.price_delta === 0
                    ? 'Standard'
                    : `+$${option.price_delta.toLocaleString()}`}
                </span>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
