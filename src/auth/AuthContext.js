import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {

  const [token, setTokenState] = useState(null)
  const [user, setUser] = useState(null)

  function setToken(newToken) {
    if (newToken) {
      sessionStorage.setItem("userToken", newToken)
      const decoded = decodeJWT(newToken)
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("userToken")
        setTokenState(null)
        setUser(null)
        return
      }
      setTokenState(newToken)
      setUser(decoded)
    } else {
      sessionStorage.removeItem("userToken")
      setTokenState(null)
      setUser(null)
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("userToken")
    if (!saved) return
    const decoded = decodeJWT(saved)
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("userToken")
      return
    }
    setTokenState(saved)
    setUser(decoded)
  }, [])

  useEffect(() => {
    if (!token) return
    const decoded = decodeJWT(token)
    if (!decoded) return
    const timeLeft = decoded.exp * 1000 - Date.now()
    if (timeLeft <= 0) {
      setToken(null)
      return
    }
    const timer = setTimeout(() => {
      setToken(null)
    }, timeLeft)
    return () => clearTimeout(timer)
  }, [token])

  function logout() {
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  return useContext(AuthContext)
}