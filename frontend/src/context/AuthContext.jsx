import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { name, role: 'student' | 'cafeteria', id }

  const loginAsStudent = (enrollment) => {
    setUser({
      id: enrollment,
      name: `Alumno ${enrollment}`,
      role: 'student'
    })
  }

  const loginAsCafeteria = (pin) => {
    if (pin === '1234') { // PIN de acceso universal para la cafetería
      setUser({
        id: 'CAF-01',
        name: 'Barra Principal TESH',
        role: 'cafeteria'
      })
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