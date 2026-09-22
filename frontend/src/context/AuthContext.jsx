import React, { createContext, useContext, useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest, msalConfig } from '../authConfig'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { instance } = useMsal()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('picktesh_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('picktesh_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('picktesh_user')
    }
  }, [user])

  // 1. Registro Real en Supabase
  const registerUser = async ({ name, email, password, enrollment }) => {
    if (!name || !email || !password) {
      return { success: false, message: 'Todos los campos marcados son obligatorios.' }
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, enrollment })
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.error || 'No se pudo crear la cuenta.' }
      }

      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: 'Error de comunicación con el servidor.' }
    }
  }

  // 2. Login con Microsoft 365
  const loginWithMicrosoft = async (demoEmail = 'l2026109482@huixquilucan.tecnm.mx') => {
    if (msalConfig.auth.clientId === 'YOUR_AZURE_CLIENT_ID_HERE') {
      const cleanEmail = demoEmail.trim().toLowerCase()
      const studentId = cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail
      const email = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@huixquilucan.tecnm.mx`

      const studentUser = {
        id: studentId,
        name: `Alumno ${studentId.toUpperCase()}`,
        email: email,
        role: 'student',
        provider: 'Microsoft 365 TecNM',
        stellarPublicKey: `G${studentId.toUpperCase()}TESHSTELLARKEYTESTNET0001`
      }

      setUser(studentUser)
      return { success: true }
    }

    try {
      const response = await instance.loginPopup(loginRequest)
      const account = response.account
      const email = account.username.toLowerCase()

      if (!email.endsWith('@huixquilucan.tecnm.mx')) {
        await instance.logoutPopup()
        return {
          success: false,
          message: 'Acceso denegado: Usa tu correo institucional @huixquilucan.tecnm.mx'
        }
      }

      const studentId = email.split('@')[0]

      const studentUser = {
        id: studentId,
        name: account.name || `Alumno ${studentId.toUpperCase()}`,
        email: email,
        role: 'student',
        provider: 'Microsoft Azure AD',
        stellarPublicKey: `G${studentId.toUpperCase()}TESHSTELLARKEYTESTNET0001`
      }

      setUser(studentUser)
      return { success: true }
    } catch (error) {
      console.error('Error en autenticación Microsoft:', error)
      return {
        success: false,
        message: 'No se completó la autenticación con Microsoft.'
      }
    }
  }

  // 3. Login Real con Validación contra Supabase
  const loginWithLocalAccount = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Ingresa tu correo y contraseña.' }
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        return { success: false, message: data.error || 'Credenciales no válidas.' }
      }

      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: 'Error de conexión con el servidor.' }
    }
  }

  // 4. Login para Cafetería
  const loginAsCafeteria = (pin) => {
    if (pin === '1234') {
      const cafeteriaUser = {
        id: 'CAF-01',
        name: 'Barra Principal TESH',
        role: 'cafeteria',
        stellarPublicKey: 'GCAFETERIATESHSTELLARKEYTESTNET0001'
      }
      setUser(cafeteriaUser)
      return true
    }
    return false
  }

  const logout = async () => {
    try {
      if (user?.provider === 'Microsoft Azure AD') {
        await instance.logoutPopup()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      registerUser,
      loginWithMicrosoft, 
      loginWithLocalAccount, 
      loginAsCafeteria, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)