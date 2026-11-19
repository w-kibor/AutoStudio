import { Check } from 'lucide-react'
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
    <div className="space-y-5">
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
            Selected Finish
          </span>
          <h4 className="text-sm font-medium text-white mt-0.5">{selectedOption.name}</h4>
        </div>
        <span className="text-xs font-medium text-zinc-300">
          {selectedOption.price_delta === 0
            ? 'Standard'
            : `+$${selectedOption.price_delta.toLocaleString()}`}
        </span>
      </div>

      {/* Swatch grid */}
      <div className="grid grid-cols-6 gap-3">
        {options.map((option) => {
          const props = option.properties as PaintProperties
          const isSelected = option.code === selectedCode

          return (
            <button
              key={option.code}
              onClick={() => onSelect(option)}
              className={`group relative aspect-square rounded-full transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                  : 'hover:scale-105 ring-1 ring-white/20 hover:ring-white/50'
              }`}
              style={{
                backgroundColor: props.hex,
                boxShadow:
                  'inset 0 1px 3px rgba(255, 255, 255, 0.25), 0 4px 10px rgba(0, 0, 0, 0.6)',
              }}
              title={`${option.name} (${
                option.price_delta === 0 ? 'Standard' : `+$${option.price_delta}`
              })`}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 ${
                    props.hex.toLowerCase() === '#f1f5f9' ||
                    props.hex.toLowerCase() === '#f8fafc' ||
                    props.hex.toLowerCase() === '#eab308'
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
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
        <div className="flex justify-between py-2 px-3 bg-zinc-950 border border-white/10">
          <span className="text-zinc-500">Finish</span>
          <span className="capitalize text-zinc-200 font-medium">{paintProps.finish}</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-zinc-950 border border-white/10">
          <span className="text-zinc-500">Clearcoat</span>
          <span className="text-zinc-200 font-medium">
            {((paintProps.clearcoat ?? 1) * 100).toFixed(0)}% Gloss
          </span>
        </div>
      </div>
    </div>
  )
}
