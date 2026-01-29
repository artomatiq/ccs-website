import { createContext, useContext, useState, useEffect } from "react"
const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null)
    useEffect(() => {
        const saved = sessionStorage.getItem("driverToken")
        if (saved) setToken(saved)
    }, [])
    return (
        <AuthContext.Provider value={{token, setToken}} >
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    return useContext(AuthContext)
}