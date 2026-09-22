import React, { useState } from 'react'
import { Zap, GraduationCap, Store, ShieldCheck, ArrowRight, Sparkles, Lock, Mail, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MichiMascot from './MichiMascot'

export default function WelcomePage() {
  const { loginAsStudent, loginAsCafeteria } = useAuth()
  const [selectedRole, setSelectedRole] = useState('student')
  const [studentIdentifier, setStudentIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')

  const handleStartSession = () => {
    if (selectedRole === 'student') {
      const res = loginAsStudent(studentIdentifier, password)
      if (!res.success) {
        alert(res.message)
      }
    } else {
      const success = loginAsCafeteria(pin.trim())
      if (!success) {
        alert('PIN de cafetería incorrecto. (PIN demo: 1234)')
      }
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden py-8">
      {/* Glows de Fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Columna Izquierda: Presentación y Mascota */}
        <div className="text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <Zap className="w-4 h-4 text-indigo-400 fill-current" />
            <span>PWA Cafetería TESH • Stellar Escrow</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Pide tu comida <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              sin hacer filas
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            PickTESH conecta a los estudiantes con la barra de la cafetería mediante pagos seguros en Smart Contracts. Elige tu horario y recoge con tu código QR.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <MichiMascot speechBubble="¡Bienvenido al TESH!" />
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                MichiTESH Anfitrión <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </p>
              <p>Sugerencias con IA y validación en tiempo real con Supabase.</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Acceso Seguro */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6 text-left transition duration-300">
          <div>
            <h2 className="text-xl font-black text-white">Acceso Institucional</h2>
            <p className="text-xs text-slate-400 mt-1">Ingresa con tus credenciales de alumno TESH o clave de barra</p>
          </div>

          {/* Selector de Rol */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Alumno
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('cafeteria')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedRole === 'cafeteria'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" /> Cafetería
            </button>
          </div>

          {/* Formulario de Entrada */}
          <div className="space-y-4">
            {selectedRole === 'student' ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Matrícula o Correo Institucional:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="2026109482 o alumno@tesh.edu.mx"
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition shadow-inner font-mono"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Contraseña:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStartSession()}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition shadow-inner font-mono"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  PIN de Seguridad de Barra:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="•••• (PIN Demo: 1234)"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartSession()}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-2xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition shadow-inner font-mono tracking-widest"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleStartSession}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-2xl transition duration-200 shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Ingresar al Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Autenticación TESH
            </span>
            <span>v1.0.0 Production</span>
          </div>
        </div>

      </div>
    </div>
  )
}