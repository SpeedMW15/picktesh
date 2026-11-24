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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl relative text-center my-auto">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado Éxito */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">¡Pedido Confirmado!</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Tus fondos han quedado protegidos en el Smart Contract de Soroban.
          </p>
        </div>

        {/* Código QR */}
        <div className="bg-white p-3.5 rounded-2xl inline-block shadow-md border-4 border-indigo-600/20">
          <QRCodeSVG 
            value={ticketData.qrPayload} 
            size={150}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Código Alfanumérico Manual (Fallback) */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Hash className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Código de Recolección Manual
          </span>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
              {ticketData.pickupCode}
            </span>
            <button 
              onClick={copyCodeToClipboard}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg transition cursor-pointer"
              title="Copiar código"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
            Muestra el QR o dicta este código de 6 dígitos en la barra si el escáner no funciona.
          </p>
        </div>

        {/* Detalle de Hora y Monto */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Hora Pickup:
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{ticketData.pickupTime} hrs</div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Monto Escrow:
            </div>
            <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{ticketData.total} $TESH</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white py-3 rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          Entendido, ir al menú
        </button>

      </div>
    </div>
  )
}