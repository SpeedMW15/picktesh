import React, { useState } from 'react'
import { Wallet, Zap, ShoppingCart, User, LogOut, Store, GraduationCap } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import WalletModal from './components/WalletModal'
import CartSidebar from './components/CartSidebar'
import TicketModal from './components/TicketModal'
import LoginModal from './components/LoginModal'
import StudentDashboard from './components/StudentDashboard'
import CafeteriaDashboard from './components/CafeteriaDashboard'

export default function App() {
  const { user, logout } = useAuth()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
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
    if (!user) {
      alert('Debes iniciar sesión primero.')
      setIsLoginModalOpen(true)
      return
    }
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar Superior */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PickTESH
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'student' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-slate-200"
              >
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition font-medium text-xs text-slate-200"
            >
              <Wallet className="w-4 h-4 text-indigo-400" />
              {walletConnected ? `${balance} $TESH` : 'Billetera'}
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300">
                {user.role === 'cafeteria' ? <Store className="w-3.5 h-3.5 text-indigo-400" /> : <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />}
                <span className="max-w-[120px] truncate">{user.name}</span>
                <button onClick={logout} className="text-slate-500 hover:text-rose-400 ml-1" title="Cerrar Sesión">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Principal Dinámico */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {user?.role === 'cafeteria' ? (
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
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} onConnectDemo={handleConnectDemo} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />
      <TicketModal isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} ticketData={ticketData} />
    </div>
  )
}