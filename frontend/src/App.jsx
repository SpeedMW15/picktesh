import React, { useState, useEffect } from 'react'
import { Wallet, Zap, ShoppingCart, LogOut, Store, GraduationCap, Sun, Moon } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import WalletModal from './components/WalletModal'
import CartSidebar from './components/CartSidebar'
import TicketModal from './components/TicketModal'
import StudentDashboard from './components/StudentDashboard'
import CafeteriaDashboard from './components/CafeteriaDashboard'
import WelcomePage from './components/WelcomePage'

export default function App() {
  const { user, logout } = useAuth()

  // Estado del Tema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('picktesh_theme')
    return saved ? saved === 'dark' : true
  })

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  
  const [walletConnected, setWalletConnected] = useState(false)
  const [balance, setBalance] = useState('100.00')
  const [cart, setCart] = useState([])
  const [ticketData, setTicketData] = useState(null)

  // Aplicar cambios al tag HTML
  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('picktesh_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('picktesh_theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

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
    <div className="min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => user && logout()}>
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-2xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-300">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                PickTESH
              </span>
              <span className="block text-[10px] font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 -mt-1">
                Stellar Escrow
              </span>
            </div>
          </div>

          {/* Botones de Cabecera */}
          <div className="flex items-center gap-2.5">
            
            {/* Interruptor del Tema */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-2xl transition cursor-pointer"
              title="Cambiar Tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {user?.role === 'student' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-2xl transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-50 dark:border-slate-950 shadow-md">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {user && (
              <button 
                onClick={() => setIsWalletModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition text-xs font-bold cursor-pointer ${
                  walletConnected 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Wallet className={`w-4 h-4 ${walletConnected ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}`} />
                <span>{walletConnected ? `${balance} $TESH` : 'Wallet'}</span>
              </button>
            )}

            {user && (
              <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user.role === 'cafeteria' ? (
                  <Store className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                )}
                <span className="max-w-[100px] truncate">{user.name}</span>
                <button 
                  onClick={logout} 
                  className="text-slate-400 hover:text-rose-500 transition ml-1 p-0.5 rounded-lg" 
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