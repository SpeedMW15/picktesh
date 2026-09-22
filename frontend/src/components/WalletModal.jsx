import React, { useState } from 'react'
import { X, Wallet, ShieldCheck, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function WalletModal({ isOpen, onClose, onConnectDemo, walletConnected, balance }) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleCopyKey = () => {
    if (user?.stellarPublicKey) {
      navigator.clipboard.writeText(user.stellarPublicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFundTestnet = async () => {
    setLoading(true)
    // Simulación de llamado al Friendbot de Stellar Testnet
    setTimeout(() => {
      onConnectDemo('100.00')
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left relative space-y-6 shadow-2xl">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Billetera Stellar TESH</h3>
              <p className="text-xs text-slate-400">Red Testnet • Soroban Smart Contracts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 text-slate-400 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Información de la Billetera del Usuario */}
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Clave Pública ($TESH)</span>
              <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20">
                Stellar Testnet
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="truncate max-w-[240px]">
                {user?.stellarPublicKey || 'No autenticado'}
              </span>
              <button onClick={handleCopyKey} className="p-1 hover:text-indigo-400 transition" title="Copiar Clave">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Saldo Disponible</span>
              <span className="text-2xl font-black text-emerald-400">
                {balance || '0.00'} <span className="text-xs text-slate-300">$TESH</span>
              </span>
            </div>

            <button
              onClick={handleFundTestnet}
              disabled={loading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{loading ? 'Obteniendo...' : 'Solicitar Tokens'}</span>
            </button>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="text-[11px] text-slate-400 leading-relaxed bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-2xl flex items-start gap-2">
          <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            Cada alumno autenticado cuenta con una cuenta de prueba vinculada a su matrícula para firmar transacciones de custodia en los Smart Contracts de Soroban.
          </span>
        </div>

      </div>
    </div>
  )
}