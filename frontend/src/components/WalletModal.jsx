import React from 'react'
import { X, Key, ShieldCheck, Cpu } from 'lucide-react'

export default function WalletModal({ isOpen, onClose, onConnectDemo }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
        {/* Botón cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Conectar Billetera</h3>
          <p className="text-slate-400 text-sm">
            Selecciona el método de autenticación para realizar pagos seguros en la red Stellar.
          </p>
        </div>

        <div className="space-y-3">
          {/* Opción 1: Cuenta Demo para desarrollo/evaluación */}
          <button
            onClick={onConnectDemo}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl flex items-center gap-3 transition group text-left border border-indigo-500/30"
          >
            <div className="p-2 bg-indigo-700/50 rounded-xl group-hover:scale-110 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Cuenta Demo TESH (Testnet)</div>
              <div className="text-xs text-indigo-200">Genera una clave temporal con 100 $TESH de prueba</div>
            </div>
          </button>

          {/* Opción 2: Extensión Freighter / Billetera Real */}
          <button
            onClick={() => alert('Extensión Freighter: Próximamente disponible en producción')}
            className="w-full bg-slate-800 hover:bg-slate-700/80 text-slate-300 p-4 rounded-2xl flex items-center gap-3 transition text-left border border-slate-700"
          >
            <div className="p-2 bg-slate-700 rounded-xl">
              <Key className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Freighter Wallet</div>
              <div className="text-xs text-slate-400">Usar extensión de navegador instalada</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}