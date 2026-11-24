import React, { useState } from 'react'
import { X, Clock, Trash2, ShieldCheck, ArrowRight, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onAddItem,
  onRemoveOneItem,
  onClearCart,
  onCheckout
}) {
  const [pickupTime, setPickupTime] = useState('12:30')

  if (!isOpen) return null

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  // Agrupar productos iguales para mostrar cantidad con + y -
  const groupedItems = Object.values(
    cart.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity: 0 }
      }
      acc[item.id].quantity += 1
      return acc
    }, {})
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-dvh max-h-dvh flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Header Fijo */}
        <div className="shrink-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Tu Bolsa Pickup
            </h3>
            {cart.length > 0 && (
              <span className="text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 transition cursor-pointer flex items-center gap-1"
                title="Vaciar bolsa"
              >
                <Trash2 className="w-3.5 h-3.5" /> Vaciar
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido Central con Scroll Adaptable */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Lista de Productos agrupados */}
          <div className="space-y-2.5">
            {groupedItems.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-slate-500 text-sm font-semibold">Tu bolsa está vacía</p>
                <p className="text-slate-400 text-xs">Regresa al menú y agrega los platillos que quieras pedir.</p>
              </div>
            ) : (
              groupedItems.map((item) => (
                <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{item.icon || '🍽️'}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                        {item.price * item.quantity} $TESH <span className="text-[10px] font-normal text-slate-400">({item.price} c/u)</span>
                      </div>
                    </div>
                  </div>

                  {/* Controles de Cantidad (+ / -) */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => onRemoveOneItem(item.id)}
                      className="p-1 text-slate-600 dark:text-slate-300 hover:text-rose-500 rounded-lg transition cursor-pointer"
                      title="Quitar uno"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-900 dark:text-white min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onAddItem(item)}
                      className="p-1 text-slate-600 dark:text-slate-300 hover:text-indigo-500 rounded-lg transition cursor-pointer"
                      title="Agregar otro"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selector de Hora de Recolección */}
          {groupedItems.length > 0 && (
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
          )}
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