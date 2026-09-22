import React, { useState, useEffect } from 'react'
import { Store, Hash, Search, CheckCircle2, AlertTriangle, RefreshCw, Clock, ShieldCheck, Activity } from 'lucide-react'

export default function CafeteriaDashboard({ user }) {
  const [inputCode, setInputCode] = useState('')
  const [scannedOrder, setScannedOrder] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)

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
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      
      {/* Header Estilo Terminal de Control */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/25">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Terminal de Barra TESH</h1>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Validación de Escrow y monitoreo de pedidos en tiempo real</p>
          </div>
        </div>

        <button 
          onClick={fetchAllOrders}
          className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl transition flex items-center gap-2 text-xs font-semibold shadow-inner"
        >
          <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} /> Sincronizar
        </button>
      </div>

      {/* Grid del Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lado Izquierdo: Validador Manual */}
        <div className="md:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-indigo-400">
            <Hash className="w-4 h-4" /> Validar por Código
          </h3>

          <form onSubmit={handleVerifyCode} className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Ej: 104015"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-white text-center font-mono text-xl tracking-widest focus:outline-none transition shadow-inner"
              />
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-2xl transition shadow-lg shadow-purple-600/25">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {statusMessage && (
            <div className={`p-4 rounded-2xl text-xs font-medium border flex items-start gap-2.5 ${
              statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {scannedOrder && (
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-inner">
              <div className="border-b border-slate-800 pb-2 flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-purple-400 font-bold font-mono">{scannedOrder.orderId}</span>
                  <h4 className="font-extrabold text-white text-sm">{scannedOrder.student}</h4>
                </div>
                <span className="text-xs bg-purple-500/10 text-purple-300 font-bold px-2 py-0.5 rounded-lg border border-purple-500/20">
                  {scannedOrder.pickupTime}
                </span>
              </div>
              
              <p className="text-xs text-slate-200 font-semibold">{scannedOrder.items}</p>
              <p className="text-sm font-black text-purple-400">{scannedOrder.total} $TESH</p>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => handleDeliverOrder()} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20">
                  Entregar
                </button>
                <button onClick={() => handleApplyPenalty()} className="bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-800 font-bold py-2.5 rounded-xl text-xs transition">
                  Penalizar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lado Derecho: Monitor de Pedidos en Tiempo Real */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-indigo-400">
              <Activity className="w-4 h-4" /> Monitor de Pedidos Activos (Supabase)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{allOrders.length} Registro(s)</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {allOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No hay pedidos registrados en la base de datos de Supabase.
              </div>
            ) : (
              allOrders.map((ord) => (
                <div key={ord.id} className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between text-xs transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        #{ord.pickup_code}
                      </span>
                      <span className="text-white font-bold">{ord.student}</span>
                    </div>
                    <p className="text-slate-300 font-medium">{ord.items}</p>
                    <span className="text-[10px] text-slate-500 block">Total: {ord.total} $TESH • Recolección: {ord.pickup_time} hrs</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.status === 'PENDING_ESCROW' ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleDeliverOrder(ord.pickup_code)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-extrabold transition shadow-md shadow-emerald-600/20">
                          Entregar
                        </button>
                        <button onClick={() => handleApplyPenalty(ord.pickup_code)} className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 rounded-xl text-[10px] font-extrabold transition">
                          Penalizar
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
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