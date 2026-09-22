import React, { useState } from 'react'
import { X, Clock, Trash2, ShieldCheck, ArrowRight } from 'lucide-react'

export default function CartSidebar({ isOpen, onClose, cart, onRemoveItem, onCheckout }) {
  const [pickupTime, setPickupTime] = useState('12:30')

  if (!isOpen) return null

  // Sume directamente los precios de cada item en el carrito
  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl">
        
        {/* Header del Carrito */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Tu Pedido Pickup
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de Hora de Recolección */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Hora estimada para recoger:
            </label>
            <input 
              type="time" 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              ⚠️ Si no recoges en un lapso de 15 min tras la hora fijada, se ejecutará la penalización en la blockchain.
            </p>
          </div>

          {/* Lista de Productos seleccionados */}
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-sm">Tu carrito está vacío</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">{item.name}</div>
                    <div className="text-xs text-indigo-400 font-medium">{item.price} $TESH</div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(index)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer y Botón de Pago con Smart Contract */}
        <div className="border-t border-slate-800 pt-4 space-y-4">
          <div className="flex items-center justify-between text-lg font-bold text-white">
            <span>Total a Bloquear (Escrow):</span>
            <span className="text-indigo-400">{total} $TESH</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={() => onCheckout(total, pickupTime)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
          >
            <ShieldCheck className="w-5 h-5" /> Confirmar y Bloquear Fondos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}