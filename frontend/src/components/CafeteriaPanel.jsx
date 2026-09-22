import React, { useState } from 'react'
import { X, QrCode, Hash, CheckCircle2, AlertTriangle, Search, ShieldCheck } from 'lucide-react'

export default function CafeteriaPanel({ isOpen, onClose }) {
  const [inputCode, setInputCode] = useState('')
  const [activeTab, setActiveTab] = useState('code') // 'code' o 'qr'
  const [scannedOrder, setScannedOrder] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  if (!isOpen) return null

  // Simulación de búsqueda por código de 6 dígitos
  const handleVerifyCode = (e) => {
    e.preventDefault()
    if (inputCode.length !== 6) {
      alert('Ingresa un código válido de 6 dígitos.')
      return
    }

    // Datos simulados recuperados del backend/escrow
    setScannedOrder({
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      student: 'Alumno TESH (G...4X9)',
      items: 'Torta de Chilaquiles x1, Café Americano x1',
      total: 53,
      pickupTime: '12:30 hrs',
      status: 'PENDIENTE_ENTREGA'
    })
    setStatusMessage(null)
  }

  // Confirmación de entrega (Libera fondos del Escrow a la Cafetería)
  const handleDeliverOrder = () => {
    setStatusMessage({
      type: 'success',
      text: '¡Entrega confirmada! Se han liberado 53 $TESH del Smart Contract a la cuenta de la Cafetería.'
    })
    setScannedOrder(null)
    setInputCode('')
  }

  // Reporte de penalización (Alumno no llegó en tiempo)
  const handleApplyPenalty = () => {
    setStatusMessage({
      type: 'penalty',
      text: 'Penalización ejecutada. Fondos transferidos a la cafetería por pedido no recolectado en tiempo.'
    })
    setScannedOrder(null)
    setInputCode('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Panel Cafetería TESH</h3>
              <p className="text-xs text-slate-400">Validación de entregas y Smart Contracts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensaje de Estado */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs font-medium border flex items-start gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Pestañas de método de validación */}
        <div className="flex bg-slate-800/60 p-1 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-4 h-4" /> Código de 6 Dígitos
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" /> Escáner de Cámara
          </button>
        </div>

        {/* Vista Opción 1: Código Manual */}
        {activeTab === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block text-left">
              Ingresa el código numérico dictado por el alumno:
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Ej: 104015"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl transition flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Vista Opción 2: Escáner QR */}
        {activeTab === 'qr' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div className="w-32 h-32 mx-auto border-2 border-dashed border-indigo-500/50 rounded-2xl flex items-center justify-center text-slate-500">
              <QrCode className="w-12 h-12 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Apunta la cámara del dispositivo hacia el código QR presentado por el alumno.
            </p>
            <button 
              onClick={() => handleVerifyCode({ preventDefault: () => {} })}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              (Simular lectura de QR exitosa)
            </button>
          </div>
        )}

        {/* Detalle del Pedido Encontrado */}
        {scannedOrder && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-left space-y-4">
            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">{scannedOrder.orderId}</span>
                <h4 className="font-bold text-white text-sm">{scannedOrder.student}</h4>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
                {scannedOrder.pickupTime}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 block">Detalle de productos:</span>
              <p className="text-slate-200 font-medium">{scannedOrder.items}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <span className="text-xs text-slate-400">Total en Escrow:</span>
              <span className="font-extrabold text-indigo-400">{scannedOrder.total} $TESH</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleDeliverOrder}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Entregar Comida
              </button>
              <button
                onClick={handleApplyPenalty}
                className="bg-slate-700 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800 border border-slate-600 text-slate-300 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1"
              >
                <AlertTriangle className="w-4 h-4" /> Aplicar Penalización
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}