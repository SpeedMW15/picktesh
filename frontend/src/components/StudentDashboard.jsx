import React, { useState, useEffect } from 'react'
import { Utensils, ShoppingBag, Clock, CheckCircle2, AlertTriangle, ShieldCheck, QrCode } from 'lucide-react'

export default function StudentDashboard({ user, onAddToCart, onOpenTicket }) {
  const [myOrders, setMyOrders] = useState([])

  // Cargar pedidos reales del alumno desde Supabase
  useEffect(() => {
    if (!user) return
    fetch('http://localhost:3001/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtrar órdenes correspondientes a este alumno
          const studentOrders = data.filter(o => o.student === user.name)
          setMyOrders(studentOrders)
        }
      })
      .catch(err => console.error('Error al cargar historial:', err))
  }, [user])

  return (
    <div className="space-y-8 text-left">
      {/* Hero Banner Alumno */}
      <section className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Panel de Alumno • {user?.name}
          </span>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Pide en la Cafetería TESH sin filas
          </h1>
          <p className="text-slate-400 text-sm">
            Tus pagos quedan retenidos de forma segura en la blockchain hasta que recojas tu pedido en barra.
          </p>
        </div>
      </section>

      {/* Menú de Selección */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Utensils className="w-5 h-5 text-indigo-400" /> Menú Disponible
          </h2>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Tiempo estimado: 10-15 min
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 1, name: 'Torta de Chilaquiles', price: 35, category: 'Desayunos' },
            { id: 2, name: 'Molletes Sencillos', price: 25, category: 'Snacks' },
            { id: 3, name: 'Café Americano 12oz', price: 18, category: 'Bebidas' }
          ].map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition">
              <div className="h-28 bg-slate-800/60 rounded-xl flex items-center justify-center text-slate-500">
                <Utensils className="w-8 h-8 opacity-40" />
              </div>
              <div>
                <span className="text-xs text-indigo-400 font-medium">{item.category}</span>
                <h3 className="font-semibold text-white">{item.name}</h3>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="font-bold text-slate-100">{item.price} $TESH</span>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Historial de Pedidos del Alumno */}
      {myOrders.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Mis Pedidos Recientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myOrders.map((ord) => (
              <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{ord.pickup_code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      ord.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                      ord.status === 'PENALIZED' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium">{ord.items}</p>
                  <p className="text-[10px] text-slate-400">Total: {ord.total} $TESH • Hora: {ord.pickup_time}</p>
                </div>
                {ord.status === 'PENDING_ESCROW' && (
                  <button
                    onClick={() => onOpenTicket({
                      pickupCode: ord.pickup_code,
                      qrPayload: JSON.stringify({ orderId: ord.order_id, code: ord.pickup_code }),
                      pickupTime: ord.pickup_time,
                      total: ord.total
                    })}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition"
                    title="Ver Ticket QR"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}