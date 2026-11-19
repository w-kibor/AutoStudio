import { Check, Copy, Share2, X } from 'lucide-react'
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
  const [buildName, setBuildName] = useState(`${vehicleName} Custom Edition`)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700/80 p-6 shadow-2xl text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 text-blue-400">
          <Share2 className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Save & Share Build</h3>
        </div>

        {!shareToken ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Configuration Name
              </label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-blue-500 text-sm text-zinc-100 placeholder-zinc-500"
                placeholder="e.g. My GT Silver Track Spec"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Configured Model</span>
                <span className="text-zinc-200">{vehicleName}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total MSRP</span>
                <span className="font-semibold text-emerald-400">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isSaving ? 'Saving Configuration...' : 'Generate Share Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-semibold text-zinc-100">Configuration Saved!</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Your unique configuration token has been generated.
              </p>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-mono text-xs text-blue-400 flex-1 truncate">
                Token: {shareToken}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
