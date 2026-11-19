import { Check, Sparkles } from 'lucide-react'
import React from 'react'
import type { CustomizationOption, PaintProperties } from '../../types/configurator'

interface PaintSelectorProps {
  options: CustomizationOption[]
  selectedCode: string
  onSelect: (option: CustomizationOption) => void
}

export const PaintSelector: React.FC<PaintSelectorProps> = ({ options, selectedCode, onSelect }) => {
  const selectedOption = options.find((o) => o.code === selectedCode) || options[0]
  const paintProps = selectedOption.properties as PaintProperties

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Current Finish</span>
          <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            {selectedOption.name}
            {paintProps.finish === 'metallic' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-2.5 h-2.5" /> Metallic
              </span>
            )}
          </h4>
        </div>
        <span className="text-xs font-semibold text-zinc-300">
          {selectedOption.price_delta === 0 ? 'Included' : `+$${selectedOption.price_delta.toLocaleString()}`}
        </span>
      </div>

      {/* Swatch grid */}
      <div className="grid grid-cols-6 gap-2.5">
        {options.map((option) => {
          const props = option.properties as PaintProperties
          const isSelected = option.code === selectedCode

          return (
            <button
              key={option.code}
              onClick={() => onSelect(option)}
              className={`group relative aspect-square rounded-full transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950 scale-105'
                  : 'hover:scale-105 hover:ring-1 hover:ring-zinc-600'
              }`}
              style={{
                backgroundColor: props.hex,
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 2px 4px rgba(0, 0, 0, 0.4)',
              }}
              title={`${option.name} (${option.price_delta === 0 ? 'Included' : `+$${option.price_delta}`})`}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 ${
                    props.hex.toLowerCase() === '#f1f5f9' || props.hex.toLowerCase() === '#eab308'
                      ? 'text-zinc-900'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Detailed paint finish telemetry */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60 text-xs text-zinc-400">
        <div className="flex justify-between py-1 px-2 rounded bg-zinc-900/60">
          <span>Finish Type</span>
          <span className="capitalize text-zinc-200">{paintProps.finish}</span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-zinc-900/60">
          <span>Clearcoat</span>
          <span className="text-zinc-200">High-Gloss ({(paintProps.clearcoat * 100).toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  )
}
