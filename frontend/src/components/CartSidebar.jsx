import React, { useState } from 'react'
import { X, Clock, Trash2, ShieldCheck, ArrowRight } from 'lucide-react'

export default function CartSidebar({ isOpen, onClose, cart, onRemoveItem, onCheckout }) {
  const [pickupTime, setPickupTime] = useState('12:30')

  if (!isOpen) return null

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-dvh max-h-dvh flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Header Fijo */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Tu Pedido Pickup
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Central con Scroll Adaptable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Selector de Hora de Recolección */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 sm:p-4 space-y-2">
            <label className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Hora estimada para recoger:
            </label>
            <input 
              type="time" 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              ⚠️ Si no recoges en un lapso de 15 min tras la hora fijada, se ejecutará la penalización en la blockchain.
            </p>
          </div>

          {/* Lista de Productos seleccionados */}
          <div className="space-y-2.5">
            {cart.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-sm">Tu carrito está vacío</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{item.price} $TESH</div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(index)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Fijo (Siempre visible en cualquier pantalla) */}
        <div className="shrink-0 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            <span>Total a Bloquear (Escrow):</span>
            <span className="text-indigo-600 dark:text-indigo-400">{total} $TESH</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => onCheckout(total, pickupTime)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" /> Confirmar y Bloquear Fondos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}