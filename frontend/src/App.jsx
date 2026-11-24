import React, { useState, useEffect } from 'react'
import { Wallet, Zap, ShoppingCart, ShoppingBag, LogOut, Store, GraduationCap, Sun, Moon, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import WalletModal from './components/WalletModal'
import CartSidebar from './components/CartSidebar'
import TicketModal from './components/TicketModal'
import StudentDashboard from './components/StudentDashboard'
import CafeteriaDashboard from './components/CafeteriaDashboard'
import WelcomePage from './components/WelcomePage'
import { API_URL } from './config/api'

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
  const [addedToast, setAddedToast] = useState(null)

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

  // Agregar producto a la bolsa SIN abrir inmediatamente el panel de pago
  const handleAddToCart = (item, showNotification = true) => {
    if (!user) return
    setCart((prev) => [...prev, item])

    if (showNotification) {
      setAddedToast(item.name)
      setTimeout(() => {
        setAddedToast((current) => (current === item.name ? null : current))
      }, 2200)
    }
  }

  // Quitar una unidad de un producto por su ID
  const handleRemoveOneItem = (itemId) => {
    setCart((prev) => {
      const index = prev.findIndex((i) => i.id === itemId)
      if (index === -1) return prev
      const updated = [...prev]
      updated.splice(index, 1)
      return updated
    })
  }

  const handleClearCart = () => {
    setCart([])
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

    // Agrupar productos repetidos para descripción limpia (ej: "2x Torta de Chilaquiles, Café Americano 12oz")
    const groupedMap = cart.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1
      return acc
    }, {})
    const itemsDescription = Object.entries(groupedMap)
      .map(([name, qty]) => (qty > 1 ? `${qty}x ${name}` : name))
      .join(', ')

    const studentName = user?.name || 'Alumno TESH'

    try {
      await fetch(`${API_URL}/api/orders`, {
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden transition-colors duration-300 pb-24">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
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
                title="Abrir bolsa de pedido"
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
                  className="text-slate-400 hover:text-rose-500 transition ml-1 p-0.5 rounded-lg cursor-pointer" 
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notificación rápida al agregar producto */}
      {addedToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 dark:bg-slate-800 text-white border border-emerald-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Agregado a tu bolsa: <span className="text-emerald-300">{addedToast}</span></span>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {!user ? (
          <WelcomePage />
        ) : user.role === 'cafeteria' ? (
          <CafeteriaDashboard user={user} />
        ) : (
          <StudentDashboard 
            user={user}
            cart={cart}
            onAddToCart={(item) => handleAddToCart(item, true)}
            onOpenTicket={(ticket) => {
              setTicketData(ticket)
              setIsTicketOpen(true)
            }}
          />
        )}
      </main>

      {/* Ícono / Barra Flotante de Bolsa (Estilo Tienda Online) */}
      {user?.role === 'student' && cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-indigo-600/40 border border-white/15 transition transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative bg-white/15 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.length}
                </span>
              </div>
              <div className="text-left">
                <span className="block text-xs font-extrabold leading-tight">Ver mi bolsa</span>
                <span className="block text-[10px] text-indigo-100">
                  {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-white/20">
              <span className="text-sm font-black">{cartTotal} $TESH</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Modales */}
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onConnectDemo={handleConnectDemo} 
        walletConnected={walletConnected}
        balance={balance}
      />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onAddItem={(item) => handleAddToCart(item, false)}
        onRemoveOneItem={handleRemoveOneItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout} 
      />
      <TicketModal isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} ticketData={ticketData} />
    </div>
  )
}