import { createContext, useEffect, useState } from 'react'
import { getMe } from './services/auth.api.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                // 401 here just means "not logged in", so it is not an error
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}