import React, { useState, useEffect } from 'react'
import { Store, Hash, Search, CheckCircle2, AlertTriangle, RefreshCw, Clock, QrCode } from 'lucide-react'

export default function CafeteriaDashboard({ user }) {
  const [inputCode, setInputCode] = useState('')
  const [scannedOrder, setScannedOrder] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // Cargar todos los pedidos de la base de datos
  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/orders')
      const data = await res.json()
      if (Array.isArray(data)) setAllOrders(data)
    } catch (err) {
      console.error('Error al cargar órdenes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // Buscar por código
  const handleVerifyCode = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (inputCode.length !== 6) {
      alert('Ingresa un código de 6 dígitos.')
      return
    }

    try {
      const res = await fetch(`http://localhost:3001/api/orders/verify/${inputCode}`)
      if (!res.ok) {
        alert('Código no encontrado en Supabase.')
        setScannedOrder(null)
        return
      }
      const data = await res.json()
      setScannedOrder(data)
      setStatusMessage(null)
    } catch (error) {
      alert('Error de conexión con el servidor.')
    }
  }

  // Marcar como entregado
  const handleDeliverOrder = async (codeToUse) => {
    const code = codeToUse || scannedOrder?.pickup_code
    try {
      await fetch(`http://localhost:3001/api/orders/${code}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      })
      setStatusMessage({
        type: 'success',
        text: '¡Entrega realizada! Fondos liberados del Escrow a la Cafetería.'
      })
      setScannedOrder(null)
      setInputCode('')
      fetchAllOrders()
    } catch (error) {
      alert('Error al actualizar estado.')
    }
  }

  // Aplicar penalización
  const handleApplyPenalty = async (codeToUse) => {
    const code = codeToUse || scannedOrder?.pickup_code
    try {
      await fetch(`http://localhost:3001/api/orders/${code}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENALIZED' })
      })
      setStatusMessage({
        type: 'penalty',
        text: 'Penalización aplicada. Importe retenido asignado a la cafetería.'
      })
      setScannedOrder(null)
      setInputCode('')
      fetchAllOrders()
    } catch (error) {
      alert('Error al penalizar.')
    }
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header del Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Dashboard Cafetería TESH</h1>
            <p className="text-slate-400 text-xs">Módulo de Administración de Barra y Escáner Escrow</p>
          </div>
        </div>
        <button 
          onClick={fetchAllOrders}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-1.5 text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {/* Validador de Códigos y Escáner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-400" /> Validar Entrega Manual
          </h3>

          <form onSubmit={handleVerifyCode} className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Código (Ej: 104015)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-center font-mono text-lg tracking-widest focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl transition">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs border flex items-start gap-2 ${
              statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {scannedOrder && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="border-b border-slate-700 pb-2">
                <span className="text-[10px] text-indigo-400 font-bold">{scannedOrder.orderId}</span>
                <h4 className="font-bold text-white text-sm">{scannedOrder.student}</h4>
              </div>
              <p className="text-xs text-slate-200 font-medium">{scannedOrder.items}</p>
              <p className="text-xs font-bold text-indigo-400">{scannedOrder.total} $TESH</p>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={() => handleDeliverOrder()} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-xl text-xs">
                  Entregar
                </button>
                <button onClick={() => handleApplyPenalty()} className="bg-slate-700 hover:bg-rose-900 text-slate-200 font-semibold py-2 rounded-xl text-xs">
                  Penalizar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabla / Monitor en Tiempo Real */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Monitor General de Pedidos (Supabase)
          </h3>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {allOrders.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No hay pedidos registrados en el sistema.</p>
            ) : (
              allOrders.map((ord) => (
                <div key={ord.id} className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">{ord.pickup_code}</span>
                      <span className="text-slate-300 font-medium">{ord.student}</span>
                    </div>
                    <p className="text-slate-400">{ord.items}</p>
                    <span className="text-[10px] text-slate-500">Monto: {ord.total} $TESH • Hora: {ord.pickup_time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.status === 'PENDING_ESCROW' ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDeliverOrder(ord.pickup_code)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold">
                          Entregar
                        </button>
                        <button onClick={() => handleApplyPenalty(ord.pickup_code)} className="px-2.5 py-1 bg-slate-700 hover:bg-rose-900 text-slate-200 rounded-lg text-[10px] font-semibold">
                          Penalizar
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ord.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {ord.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}