import React, { useState, useEffect } from 'react'
import { Utensils, ShoppingBag, Clock, ShieldCheck, QrCode, RefreshCw, Sparkles, ArrowDownCircle, Coins, Cpu, CheckCircle2, FileText, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react'
import MichiMascot from './MichiMascot'

export default function StudentDashboard({ user, onAddToCart, onOpenTicket }) {
  const [myOrders, setMyOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)
  
  // Estado de Recarga $TESH
  const [recharging, setRecharging] = useState(false)
  const [walletBalance, setWalletBalance] = useState('100.00')
  const [showRecargaMsg, setShowRecargaMsg] = useState(false)

  // Ledger de Transacciones
  const [transactions, setTransactions] = useState([
    {
      id: 'TX-1001',
      type: 'RECHARGE',
      description: 'Recarga inicial Faucet Stellar Friendbot',
      amount: 100.00,
      date: '2026-09-22 09:00',
      status: 'SUCCESS'
    }
  ])

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

        const orderTxList = filtered.map(ord => ({
          id: `TX-${ord.pickup_code}`,
          type: ord.status === 'COMPLETED' ? 'PAYMENT' : ord.status === 'PENALIZED' ? 'PENALTY' : 'ESCROW_HOLD',
          description: `Pedido #${ord.pickup_code} - ${ord.items}`,
          amount: ord.total,
          date: ord.created_at ? new Date(ord.created_at).toLocaleString() : 'Reciente',
          status: ord.status
        }))

        setTransactions(prev => {
          const recharges = prev.filter(t => t.type === 'RECHARGE')
          return [...recharges, ...orderTxList]
        })
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

  const handleAskAI = async () => {
    setLoadingAi(true)
    setAiRecommendation('')
    try {
      const res = await fetch('http://localhost:3001/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preference: 'Desayuno rico para estudiar' })
      })
      const data = await res.json()
      if (data && data.recommendation) {
        setAiRecommendation(data.recommendation)
      } else {
        setAiRecommendation('¡MichiTESH sugiere: Una Torta de Chilaquiles con Café Americano!')
      }
    } catch (err) {
      console.error('Error al consultar IA:', err)
      setAiRecommendation('¡MichiTESH sugiere: Molletes Sencillos calentitos!')
    } finally {
      setLoadingAi(false)
    }
  }

  const handleRechargeWallet = () => {
    setRecharging(true)
    setShowRecargaMsg(false)
    setTimeout(() => {
      const current = parseFloat(walletBalance)
      const newBal = (current + 50.00).toFixed(2)
      setWalletBalance(newBal)

      const newTx = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'RECHARGE',
        description: 'Recarga +50 $TESH (Stellar Faucet)',
        amount: 50.00,
        date: new Date().toLocaleString(),
        status: 'SUCCESS'
      }

      setTransactions(prev => [newTx, ...prev])
      setRecharging(false)
      setShowRecargaMsg(true)
      setTimeout(() => setShowRecargaMsg(false), 4000)
    }, 1500)
  }

  const totalSpent = myOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const totalHeld = myOrders
    .filter(o => o.status === 'PENDING_ESCROW')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const totalPenalized = myOrders
    .filter(o => o.status === 'PENALIZED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="space-y-10 text-left">
      
      {/* Hero Banner Adaptable Claro / Oscuro */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-100 via-white to-slate-100 dark:from-slate-900/90 dark:via-slate-950 dark:to-indigo-950/40 p-8 md:p-10 shadow-lg dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Smart Contract Escrow • Soroban Testnet</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Pide en la <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-300 dark:via-purple-300 dark:to-amber-200 bg-clip-text text-transparent">Cafetería TESH</span> sin hacer filas
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Programa tu hora de recolección, paga con $TESH en custodia y recoge en barra presentando tu código QR.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <MichiMascot speechBubble="¡Hola TESH!" />
        </div>
      </section>

      {/* MÓDULO DE BILLETERA Y SMART CONTRACTS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 shadow-md dark:shadow-xl flex flex-col justify-between space-y-4 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" /> Mi Billetera $TESH
              </span>
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                Stellar Testnet
              </span>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{walletBalance}</span>
              <span className="text-sm font-extrabold text-amber-500 ml-2">$TESH</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
              {user?.stellarPublicKey || 'G...TESHSTELLARKEY'}
            </p>
          </div>

          <div>
            <button
              onClick={handleRechargeWallet}
              disabled={recharging}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {recharging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowDownCircle className="w-4 h-4" />}
              <span>{recharging ? 'Solicitando a Stellar...' : 'Recargar +50 $TESH (Faucet)'}</span>
            </button>

            {showRecargaMsg && (
              <div className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] rounded-xl font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>¡Recarga exitosa desde Stellar Friendbot!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-3 md:col-span-2 flex flex-col justify-between transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Estado de Pagos & Smart Contract Soroban</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tus compras quedan protegidas en un contrato de **Escrow (Custodia temporal)**. Los tokens $TESH se bloquean en la red al ordenar y solo se transfieren a la cafetería cuando el personal escanea tu ticket QR en barra.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px]">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <span className="block font-bold text-amber-600 dark:text-amber-400">1. Pendiente</span>
              <span className="text-slate-500 text-[10px]">Fondos retenidos</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <span className="block font-bold text-emerald-600 dark:text-emerald-400">2. Entrega QR</span>
              <span className="text-slate-500 text-[10px]">Validación en barra</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800/80">
              <span className="block font-bold text-indigo-600 dark:text-indigo-400">3. Liberación</span>
              <span className="text-slate-500 text-[10px]">Pago completado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Asistente IA MichiTESH */}
      <section className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 shadow-md dark:shadow-xl relative overflow-hidden space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MichiMascot 
              state={loadingAi ? 'thinking' : 'idle'} 
              speechBubble={loadingAi ? 'Miau... pensando' : null} 
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Asistente MichiTESH <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">¿No sabes qué pedir? Pídele una recomendación al instante</p>
            </div>
          </div>

          <button
            onClick={handleAskAI}
            disabled={loadingAi}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
          >
            {loadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loadingAi ? 'Michi analizando...' : '¡Pedir sugerencia a Michi!'}</span>
          </button>
        </div>

        {aiRecommendation && (
          <div className="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-indigo-500/30 rounded-2xl p-4 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium animate-fadeIn">
            🐾 <span className="font-bold text-slate-900 dark:text-white">MichiTESH dice:</span> {aiRecommendation}
          </div>
        )}
      </section>

      {/* Menú Digital */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Utensils className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Menú Digital
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selecciona tus platillos y bloquea tus fondos en custodia</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Preparación: 10-15 min
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
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 transition duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-36 bg-slate-50 dark:bg-slate-950/60 rounded-2xl flex items-center justify-center text-5xl border border-slate-200 dark:border-slate-800/60">
                  {item.icon}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg inline-block mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-4">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{item.price} <span className="text-xs text-indigo-500">$TESH</span></span>
                </div>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mis Pedidos Activos */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Mis Pedidos Activos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sincronizado en tiempo real con Supabase</p>
          </div>
          <button 
            onClick={fetchMyOrders}
            className="p-2.5 bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No tienes pedidos registrados a tu nombre todavía.</p>
            <p className="text-xs text-slate-400 dark:text-slate-600">Selecciona algún platillo del menú para realizar tu primer compra en Escrow.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myOrders.map((ord) => (
              <div 
                key={ord.id} 
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between shadow-md transition"
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg">
                      #{ord.pickup_code}
                    </span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                      ord.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' :
                      ord.status === 'PENALIZED' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{ord.items}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total: <span className="text-indigo-600 dark:text-indigo-300 font-bold">{ord.total} $TESH</span> • Recolección: <span className="text-slate-700 dark:text-slate-200">{ord.pickup_time} hrs</span></p>
                </div>

                {ord.status === 'PENDING_ESCROW' && (
                  <button
                    onClick={() => onOpenTicket({
                      pickupCode: ord.pickup_code,
                      qrPayload: JSON.stringify({ orderId: ord.order_id, code: ord.pickup_code }),
                      pickupTime: ord.pickup_time,
                      total: ord.total
                    })}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center group cursor-pointer"
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

      {/* ESTADO DE CUENTA Y LEDGER DE TRANSACCIONES */}
      <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800/80">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Estado de Cuenta & Historial $TESH
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Desglose de consumos, retenciones en custodia y penalizaciones</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-3.5 py-2 text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Gastado</span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{totalSpent} $TESH</span>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-3.5 py-2 text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">En Custodia</span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">{totalHeld} $TESH</span>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-3.5 py-2 text-left">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Penalizado</span>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400">{totalPenalized} $TESH</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md dark:shadow-xl">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No hay movimientos contables registrados todavía.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {transactions.map((tx, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition text-left">
                  
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-2xl shrink-0 ${
                      tx.type === 'RECHARGE' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' :
                      tx.type === 'PENALTY' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20' :
                      tx.type === 'ESCROW_HOLD' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' :
                      'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {tx.type === 'RECHARGE' ? <ArrowDownLeft className="w-4 h-4" /> :
                       tx.type === 'PENALTY' ? <AlertTriangle className="w-4 h-4" /> :
                       <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tx.description}</h4>
                      <span className="text-[10px] font-mono text-slate-500 block">{tx.id} • {tx.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-mono font-black block ${
                      tx.type === 'RECHARGE' ? 'text-emerald-600 dark:text-emerald-400' :
                      tx.type === 'PENALTY' ? 'text-rose-600 dark:text-rose-400' :
                      tx.type === 'ESCROW_HOLD' ? 'text-amber-600 dark:text-amber-400' :
                      'text-indigo-600 dark:text-indigo-300'
                    }`}>
                      {tx.type === 'RECHARGE' ? '+' : '-'}{tx.amount} $TESH
                    </span>
                    
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      tx.type === 'RECHARGE' || tx.status === 'COMPLETED' ? 'text-emerald-600 dark:text-emerald-400' :
                      tx.status === 'PENALIZED' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {tx.type === 'RECHARGE' ? 'COMPLETADO' : tx.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </section>

    </div>
  )
}