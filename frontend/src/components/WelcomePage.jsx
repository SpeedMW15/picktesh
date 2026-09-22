import React, { useState } from 'react'
import { Zap, GraduationCap, Store, ShieldCheck, ArrowRight, Sparkles, Lock, Mail, KeyRound, UserCheck, UserPlus, IdCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MichiMascot from './MichiMascot'

export default function WelcomePage() {
  const { registerUser, loginWithMicrosoft, loginWithLocalAccount, loginAsCafeteria } = useAuth()
  
  // Modos y Roles
  const [isRegistering, setIsRegistering] = useState(false) // Toggle Iniciar Sesión / Registrarse
  const [selectedRole, setSelectedRole] = useState('student') // 'student' | 'cafeteria'
  const [authMethod, setAuthMethod] = useState('microsoft') // 'microsoft' | 'local'

  // Formulario de Login
  const [msEmail, setMsEmail] = useState('')
  const [localEmail, setLocalEmail] = useState('')
  const [localPassword, setLocalPassword] = useState('')
  const [pin, setPin] = useState('')

  // Formulario de Registro
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regEnrollment, setRegEnrollment] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const handleStartSession = async () => {
    setLoading(true)

    // Flujo de Registro
    if (isRegistering) {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        enrollment: regEnrollment,
        password: regPassword
      })
      setLoading(false)
      if (!res.success) alert(res.message)
      return
    }

    // Flujo de Inicio de Sesión
    if (selectedRole === 'student') {
      if (authMethod === 'microsoft') {
        const res = await loginWithMicrosoft(msEmail || 'l2026109482@huixquilucan.tecnm.mx')
        setLoading(false)
        if (!res.success) alert(res.message)
      } else {
        const res = loginWithLocalAccount(localEmail, localPassword)
        setLoading(false)
        if (!res.success) alert(res.message)
      }
    } else {
      setLoading(false)
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
            PickTESH conecta a los estudiantes del Tecnológico de Estudios Superiores de Huixquilucan con la barra mediante pagos seguros en Smart Contracts.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <MichiMascot speechBubble="¡Bienvenido al TESH!" />
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                MichiTESH Anfitrión <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </p>
              <p>Seguridad y generación automática de billeteras Stellar.</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Acceso y Registro */}
        <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6 text-left transition duration-300">
          
          {/* Selector Login / Registro */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-black text-white">
                {isRegistering ? 'Crear Cuenta PickTESH' : 'Iniciar Sesión'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRegistering ? 'Registra tu perfil y vincula tu billetera' : 'Elige tu método de acceso preferido'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4"
            >
              {isRegistering ? '¿Ya tienes cuenta?' : '¿Nuevo usuario?'}
            </button>
          </div>

          {!isRegistering ? (
            /* MODO INICIO DE SESIÓN */
            <div className="space-y-6">
              {/* Selector de Rol Principal */}
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
                  <GraduationCap className="w-4 h-4" /> Alumno / Usuario
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

              {selectedRole === 'student' ? (
                <div className="space-y-4">
                  {/* Pestañas Sub-método */}
                  <div className="flex border-b border-slate-800 gap-4 pb-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('microsoft')}
                      className={`pb-1 transition flex items-center gap-1.5 ${
                        authMethod === 'microsoft'
                          ? 'text-indigo-400 border-b-2 border-indigo-500'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Correo Institucional
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('local')}
                      className={`pb-1 transition flex items-center gap-1.5 ${
                        authMethod === 'local'
                          ? 'text-indigo-400 border-b-2 border-indigo-500'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Cuenta PickTESH
                    </button>
                  </div>

                  {authMethod === 'microsoft' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Correo Microsoft (@huixquilucan.tecnm.mx):
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="l2026109482@huixquilucan.tecnm.mx"
                          value={msEmail}
                          onChange={(e) => setMsEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono"
                        />
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 block">Correo Electrónico:</label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="usuario@ejemplo.com"
                            value={localEmail}
                            onChange={(e) => setLocalEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono"
                          />
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 block">Contraseña:</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={localPassword}
                            onChange={(e) => setLocalPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono"
                          />
                          <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">PIN de Seguridad de Barra:</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="•••• (PIN Demo: 1234)"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono tracking-widest"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MODO REGISTRO DE NUEVA CUENTA */
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Nombre Completo:</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition"
                  />
                  <UserPlus className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Correo Electrónico:</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="l2026109482@huixquilucan.tecnm.mx"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Matrícula (Opcional para alumnos):</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: 2026109482"
                    value={regEnrollment}
                    onChange={(e) => setRegEnrollment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono"
                  />
                  <IdCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Contraseña de Seguridad:</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-white text-xs focus:outline-none transition font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* Botón de Acción Principal */}
          <button
            type="button"
            onClick={handleStartSession}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition duration-200 shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>
              {loading 
                ? 'Procesando...' 
                : isRegistering 
                ? 'Completar Registro y Crear Billetera' 
                : 'Entrar al Dashboard'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Billetera Cifrada Stellar
            </span>
            <span>v1.0.0 Production</span>
          </div>
        </div>

      </div>
    </div>
  )
}