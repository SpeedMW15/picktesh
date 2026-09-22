import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, CheckCircle2, Clock, Hash, Copy, ShieldCheck } from 'lucide-react'

export default function TicketModal({ isOpen, onClose, ticketData }) {
  if (!isOpen || !ticketData) return null

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(ticketData.pickupCode)
    alert('Código copiado al portapapeles: ' + ticketData.pickupCode)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-center">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado Éxito */}
        <div className="space-y-2">
          <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-1 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">¡Pedido Confirmado!</h3>
          <p className="text-slate-400 text-xs">
            Tus fondos han quedado protegidos en el Smart Contract de Soroban.
          </p>
        </div>

        {/* Código QR */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border-4 border-indigo-600/30">
          <QRCodeSVG 
            value={ticketData.qrPayload} 
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Código Alfanumérico Manual (Fallback) */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Hash className="w-3.5 h-3.5 text-indigo-400" /> Código de Recolección Manual
          </span>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-black tracking-widest text-indigo-400 font-mono">
              {ticketData.pickupCode}
            </span>
            <button 
              onClick={copyCodeToClipboard}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-700/50 rounded-lg transition"
              title="Copiar código"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Muestra el QR o dicta este código de 6 dígitos en la barra si el escáner no funciona.
          </p>
        </div>

        {/* Detalle de Hora y Penalización */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" /> Hora Pickup:
            </div>
            <div className="font-bold text-sm text-slate-100">{ticketData.pickupTime} hrs</div>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" /> Monto Escrow:
            </div>
            <div className="font-bold text-sm text-indigo-400">{ticketData.total} $TESH</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl text-sm font-semibold transition"
        >
          Entendido, ir al menú
        </button>

      </div>
    </div>
  )
}