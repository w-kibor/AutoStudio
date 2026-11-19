import { Check, Copy, X } from 'lucide-react'
import React, { useState } from 'react'

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => Promise<{ share_token: string } | null>
  totalPrice: number
  vehicleName: string
}

export const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  totalPrice,
  vehicleName,
}) => {
  const [buildName, setBuildName] = useState(`${vehicleName} Bespoke Spec`)
  const [isSaving, setIsSaving] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const result = await onSave(buildName)
    setIsSaving(false)
    if (result?.share_token) {
      setShareToken(result.share_token)
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?config=${shareToken}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/20 p-7 shadow-2xl text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            AutoStudio Atelier
          </span>
          <h3 className="font-serif text-2xl font-medium text-white mt-1">
            Save Configuration
          </h3>
        </div>

        {!shareToken ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-zinc-400 mb-2">
                Commission Title
              </label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-black border border-white/20 focus:outline-none focus:border-white text-sm text-white placeholder-zinc-600"
                placeholder="e.g. Obsidian GT Track Spec"
              />
            </div>

            <div className="p-4 bg-black border border-white/10 text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Model</span>
                <span className="text-white font-medium">{vehicleName}</span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-2 border-t border-white/10">
                <span>Total MSRP</span>
                <span className="font-semibold text-white">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold text-xs uppercase tracking-[0.18em] transition-all disabled:opacity-50"
            >
              {isSaving ? 'Generating Code...' : 'Generate Configuration Code'}
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-serif text-xl text-white">Build Saved</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Share or retrieve your configuration anytime using your unique code.
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-black border border-white/15">
              <span className="font-mono text-xs text-white flex-1 truncate">
                {shareToken}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-[11px] font-semibold uppercase tracking-wider transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 border border-white/20 hover:bg-white/10 text-zinc-300 text-xs uppercase tracking-[0.15em] transition-colors"
            >
              Return to Studio
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
