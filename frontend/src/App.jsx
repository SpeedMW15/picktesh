import React, { useState } from 'react'
import { Wallet, Utensils, Zap, Clock, ShieldCheck, ShoppingBag, ShoppingCart, Store } from 'lucide-react'
import WalletModal from './components/WalletModal'
import CartSidebar from './components/CartSidebar'
import TicketModal from './components/TicketModal'
import CafeteriaPanel from './components/CafeteriaPanel'

export default function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const [isCafeteriaPanelOpen, setIsCafeteriaPanelOpen] = useState(false)
  
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
    setCart((prev) => [...prev, item])
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleCheckout = (total, time) => {
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
      {/* Header / Navbar */}
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
            {/* Botón Acceso Panel Cafetería */}
            <button 
              onClick={() => setIsCafeteriaPanelOpen(true)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition text-slate-300 flex items-center gap-1.5 text-xs font-semibold"
              title="Modo Cafetería / Escáner"
            >
              <Store className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Panel Cafetería</span>
            </button>

            {/* Carrito */}
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

            {/* Billetera */}
            <button 
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition font-medium text-sm text-slate-200"
            >
              <Wallet className="w-4 h-4 text-indigo-400" />
              {walletConnected ? `${balance} $TESH` : 'Conectar Billetera'}
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Pagos seguros en Stellar Soroban
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Pide tu comida en la Cafetería TESH sin filas
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Programa la hora de entrega, paga con la cripto del TESH y recoge directo en barra. Depósitos protegidos por Smart Contracts.
            </p>
          </div>
        </section>

        {/* Menú */}
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
                <div className="h-32 bg-slate-800/60 rounded-xl flex items-center justify-center text-slate-500">
                  <Utensils className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <span className="text-xs text-indigo-400 font-medium">{item.category}</span>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="font-bold text-slate-100">{item.price} $TESH</span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modales */}
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onConnectDemo={handleConnectDemo}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <TicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        ticketData={ticketData}
      />

      <CafeteriaPanel
        isOpen={isCafeteriaPanelOpen}
        onClose={() => setIsCafeteriaPanelOpen(false)}
      />
    </div>
  )
}