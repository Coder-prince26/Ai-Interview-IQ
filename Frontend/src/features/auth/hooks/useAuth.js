import { useContext, useState } from "react"
import { AuthContext } from "../auth.context"
import { login, register, logout } from "../services/auth.api"

// Reads the message sent by our backend. If the server could not be reached, shows a general message.
const getErrorMessage = (err, fallback) => {
    if (!err.response) {
        return "Cannot connect to the server. Please try again."
    }
    return err.response.data?.message || fallback
}

export const useAuth = () => {
    const { user, setUser, loading } = useContext(AuthContext)

    // These two belong only to the component that calls this hook (for example the Login form)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Returns true if login worked, so the page knows whether to navigate
    const handleLogin = async ({ email, password }) => {
        setSubmitting(true)
        setError("")

        try {
            const data = await login({ email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(getErrorMessage(err, "Login failed. Please try again."))
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setSubmitting(true)
        setError("")

        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return true
        } catch (err) {
            setError(getErrorMessage(err, "Registration failed. Please try again."))
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
        } catch (err) {
            console.log("Logout request failed:", err.message)
        } finally {
            // Even if the request failed, the user is logged out on this screen
            setUser(null)
        }
    }

    return { user, loading, submitting, error, handleLogin, handleRegister, handleLogout }
}