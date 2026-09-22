import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
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

  // Login para Alumnos (Matrícula o Correo Institucional + Contraseña)
  const loginAsStudent = (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: 'Ingresa tu matrícula/correo y contraseña.' }
    }

    // Normalizar correo/matrícula
    const isEmail = identifier.includes('@')
    const studentId = isEmail ? identifier.split('@')[0] : identifier
    const studentEmail = isEmail ? identifier : `${studentId}@tesh.edu.mx`

    const studentUser = {
      id: studentId,
      name: `Alumno ${studentId}`,
      email: studentEmail,
      role: 'student',
      // Clave pública simulada o generada para Soroban/Stellar
      stellarPublicKey: `G${studentId.toUpperCase()}TESHSTELLARKEYTESTNET0001`
    }

    setUser(studentUser)
    return { success: true }
  }

  // Login para Cafetería
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

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsCafeteria, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)