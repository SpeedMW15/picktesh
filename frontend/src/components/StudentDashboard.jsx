import React, { useState, useEffect } from 'react'
import { Utensils, ShoppingBag, Clock, ShieldCheck, QrCode, RefreshCw, Sparkles, ChevronRight } from 'lucide-react'

export default function StudentDashboard({ user, onAddToCart, onOpenTicket }) {
  const [myOrders, setMyOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMyOrders = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/orders')
      const data = await res.json()
      if (Array.isArray(data)) {
        const filtered = data.filter(
          o => o.student === user.name || o.student.includes(user.id)
        )
        setMyOrders(filtered)
      }
    } catch (err) {
      console.error('Error al cargar historial:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [user])

  return (
    <div className="space-y-10 text-left">
      
      {/* Hero Banner Pro Alumno */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Smart Contract Escrow • Soroban Testnet</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Pide tu comida en la <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Cafetería TESH</span> sin filas
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Programa tu hora de recolección, paga con la cripto del TESH y recoge en barra presentando tu código QR o de rescate.
          </p>
        </div>
      </section>

      {/* Menú Interactivo */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Utensils className="w-6 h-6 text-indigo-400" /> Menú Digital
            </h2>
            <p className="text-xs text-slate-400 mt-1">Selecciona tus platillos y bloquea tus fondos en custodia</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Preparación: 10-15 min
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 1, name: 'Torta de Chilaquiles', price: 35, category: 'Desayunos', icon: '🌯' },
            { id: 2, name: 'Molletes Sencillos', price: 25, category: 'Snacks', icon: '🍞' },
            { id: 3, name: 'Café Americano 12oz', price: 18, category: 'Bebidas', icon: '☕' }
          ].map(item => (
            <div 
              key={item.id} 
              className="group relative bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 transition duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="h-36 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl flex items-center justify-center text-5xl border border-slate-800/50 group-hover:scale-105 transition duration-300">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg inline-block mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-200 transition">{item.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Precio</span>
                  <span className="text-xl font-black text-indigo-400">{item.price} <span className="text-xs text-indigo-300">$TESH</span></span>
                </div>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mis Pedidos / Historial */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Mis Pedidos Activos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Sincronizado en tiempo real con Supabase</p>
          </div>
          <button 
            onClick={fetchMyOrders}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-2xl transition flex items-center gap-2 text-xs font-semibold shadow-inner"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No tienes pedidos registrados a tu nombre todavía.</p>
            <p className="text-xs text-slate-600">Selecciona algún platillo del menú para realizar tu primer compra en Escrow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myOrders.map((ord) => (
              <div 
                key={ord.id} 
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex items-center justify-between shadow-lg transition"
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg">
                      #{ord.pickup_code}
                    </span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                      ord.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ord.status === 'PENALIZED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{ord.items}</p>
                  <p className="text-xs text-slate-400 font-medium">Total: <span className="text-indigo-300 font-bold">{ord.total} $TESH</span> • Recolección: <span className="text-slate-200">{ord.pickup_time} hrs</span></p>
                </div>

                {ord.status === 'PENDING_ESCROW' && (
                  <button
                    onClick={() => onOpenTicket({
                      pickupCode: ord.pickup_code,
                      qrPayload: JSON.stringify({ orderId: ord.order_id, code: ord.pickup_code }),
                      pickupTime: ord.pickup_time,
                      total: ord.total
                    })}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center group"
                    title="Ver Ticket QR"
                  >
                    <QrCode className="w-5 h-5 group-hover:scale-110 transition" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}