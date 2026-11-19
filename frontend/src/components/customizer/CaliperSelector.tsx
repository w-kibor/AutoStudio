import { Check } from 'lucide-react'
import React from 'react'
import type { CaliperProperties, CustomizationOption } from '../../types/configurator'

interface CaliperSelectorProps {
  options: CustomizationOption[]
  selectedCode: string
  onSelect: (option: CustomizationOption) => void
}

export const CaliperSelector: React.FC<CaliperSelectorProps> = ({
  options,
  selectedCode,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
          Brake Calipers
        </span>
        <span className="text-[11px] text-zinc-400">Composite System</span>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const props = option.properties as CaliperProperties
          const isSelected = option.code === selectedCode

          return (
            <button
              key={option.code}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-3.5 border transition-all flex items-center justify-between ${isSelected
                ? 'bg-zinc-900 border-white text-white'
                : 'bg-zinc-950/80 border-white/10 text-zinc-300 hover:border-white/30 hover:bg-zinc-900/50'
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-5 h-5 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: props.hex }}
                />
                <div>
                  <h4 className="text-xs font-medium text-white">{option.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Heat-Resistant Anodized Finish
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
