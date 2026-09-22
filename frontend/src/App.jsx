import React, { useState } from 'react'
import { Wallet, Zap, ShoppingCart, LogOut, Store, GraduationCap } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import WalletModal from './components/WalletModal'
import CartSidebar from './components/CartSidebar'
import TicketModal from './components/TicketModal'
import StudentDashboard from './components/StudentDashboard'
import CafeteriaDashboard from './components/CafeteriaDashboard'
import WelcomePage from './components/WelcomePage'

export default function App() {
  const { user, logout } = useAuth()

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  
  const [walletConnected, setWalletConnected] = useState(false)
  const [balance, setBalance] = useState('0.00')
  const [cart, setCart] = useState([])
  const [ticketData, setTicketData] = useState(null)

  const handleConnectDemo = () => {
    setBalance('100.00')
    setWalletConnected(true)
    setIsWalletModalOpen(false)
  }

  const handleAddToCart = (item) => {
    if (!user) return
    setCart((prev) => [...prev, item])
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleCheckout = async (total, time) => {
    if (!walletConnected) {
      alert('Por favor conecta tu billetera primero para firmar la transacción.')
      setIsWalletModalOpen(true)
      return
    }
    
    if (parseFloat(balance) < total) {
      alert('Saldo insuficiente en $TESH para cubrir este pedido.')
      return
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
    const itemsDescription = cart.map(i => i.name).join(', ')
    const studentName = user?.name || 'Alumno TESH'

    try {
      await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupCode: randomCode,
          student: studentName,
          items: itemsDescription,
          total: total,
          pickupTime: time
        })
      })
    } catch (err) {
      console.error('Error al guardar en Supabase:', err)
    }

    const qrPayloadData = JSON.stringify({
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      code: randomCode,
      amount: total,
      time: time
    })

    setBalance((prev) => (parseFloat(prev) - total).toFixed(2))

    setTicketData({
      pickupCode: randomCode,
      qrPayload: qrPayloadData,
      pickupTime: time,
      total: total
    })

    setCart([])
    setIsCartOpen(false)
    setIsTicketOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Glows de Fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Header Glassmorphism */}
      <header className="border-b border-slate-800/80 glass-panel sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Logo PickTESH */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => user && logout()}>
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-2xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-300">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                PickTESH
              </span>
              <span className="block text-[10px] font-semibold tracking-widest uppercase text-indigo-400/80 -mt-1">
                Stellar Escrow
              </span>
            </div>
          </div>

          {/* Acciones del Header (Solo se muestran con usuario autenticado) */}
          <div className="flex items-center gap-3">
            {user?.role === 'student' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl transition duration-200 text-slate-200 shadow-inner group"
              >
                <ShoppingCart className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-200" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {user && (
              <button 
                onClick={() => setIsWalletModalOpen(true)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition duration-200 font-semibold text-xs ${
                  walletConnected 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-emerald' 
                    : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/40 text-slate-300'
                }`}
              >
                <Wallet className={`w-4 h-4 ${walletConnected ? 'text-emerald-400' : 'text-indigo-400'}`} />
                <span>{walletConnected ? `${balance} $TESH` : 'Conectar Wallet'}</span>
              </button>
            )}

            {user && (
              <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-inner">
                {user.role === 'cafeteria' ? (
                  <Store className="w-4 h-4 text-purple-400" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                )}
                <span className="max-w-[120px] truncate">{user.name}</span>
                <button 
                  onClick={logout} 
                  className="text-slate-500 hover:text-rose-400 transition ml-1 p-0.5 rounded-lg hover:bg-slate-800" 
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {!user ? (
          <WelcomePage />
        ) : user.role === 'cafeteria' ? (
          <CafeteriaDashboard user={user} />
        ) : (
          <StudentDashboard 
            user={user} 
            onAddToCart={handleAddToCart}
            onOpenTicket={(ticket) => {
              setTicketData(ticket)
              setIsTicketOpen(true)
            }}
          />
        )}
      </main>

      {/* Modales */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} onConnectDemo={handleConnectDemo} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />
      <TicketModal isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} ticketData={ticketData} />
    </div>
  )
}