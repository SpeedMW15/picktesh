import React, { useState } from 'react'
import { GraduationCap, Store, ShieldCheck, ArrowRight, KeyRound, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const { loginAsStudent, loginAsCafeteria } = useAuth()
  const [roleTab, setRoleTab] = useState('student') // 'student' | 'cafeteria'
  const [enrollment, setEnrollment] = useState('')
  const [pin, setPin] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    if (roleTab === 'student') {
      if (!enrollment.trim()) {
        alert('Por favor ingresa tu matrícula o correo institucional.')
        return
      }
      loginAsStudent(enrollment)
      onClose()
    } else {
      const success = loginAsCafeteria(pin)
      if (success) {
        onClose()
      } else {
        alert('PIN incorrecto. Intenta con el PIN por defecto: 1234')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative text-left">
        
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl mb-1 border border-indigo-500/20">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Acceso a PickTESH</h3>
          <p className="text-slate-400 text-xs">
            Selecciona tu perfil para ingresar a la plataforma
          </p>
        </div>

        {/* Pestañas de Selección de Rol */}
        <div className="flex bg-slate-800/60 p-1 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setRoleTab('student')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              roleTab === 'student' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Alumno TESH
          </button>
          <button
            onClick={() => setRoleTab('cafeteria')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
              roleTab === 'cafeteria' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" /> Personal Cafetería
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {roleTab === 'student' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Matrícula o Correo Institucional:
              </label>
              <input 
                type="text" 
                placeholder="Ej. 2026109482 o alumno@tesh.edu.mx"
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> PIN de Acceso a Barra (Cafetería):
              </label>
              <input 
                type="password" 
                maxLength={4}
                placeholder="PIN (Demostración: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            Iniciar Sesión <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  )
}