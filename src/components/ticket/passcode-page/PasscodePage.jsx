import "../ticket/ticket.css"
import "./passcodePage.css"
import { useState, useRef, useEffect } from "react"
import Swal from "sweetalert2"
import loginUser from "../../../api/userLogin"
import { useAuth, decodeJWT } from "../../../auth/AuthContext"
import { useNavigate } from "react-router-dom"

const PasscodePage = () => {
    const [passcode, setPasscode] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setToken } = useAuth()
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { value } = e.target
        setPasscode(value)
    }
    const spanRef = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            spanRef.current?.classList.add("show")
        }, 300)

        return () => clearTimeout(timer)
    }, [])
    const handleLogin = async (e) => {
        e.preventDefault()
        if (isSubmitting || passcode.length < 4) return
        setIsSubmitting(true)
        try {
            const res = await loginUser(passcode)
            const token = res.token
            if (!token) throw new Error(res.error)
            sessionStorage.setItem("userToken", token)
            setToken(token)
            const decoded = decodeJWT(token)
            const destination = decoded?.user === "ADMIN" ? "/ticket/admin/dash" : "/ticket/driver/welcome"
            navigate(destination, { replace: true })
        } catch (error) {
            setIsSubmitting(false)
            Swal.fire({
                title: "Login failed",
                text: error.message,
                icon: "warning",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
        }
    }
    return (
        <div
            className="quote-container ticket-container section"
            id="ticket-login-id"
        >
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Welcome
                </span>
            </div>
            <form className="ticket__form quote__form" id="ticket-login">
                <div className="passcode input segment" id="passcode-input">
                    <div className="form-div passcode">
                        <input
                            type="password"
                            name="passcode"
                            className="passcode-input"
                            id="passcode-input"
                            placeholder="Enter user passcode"
                            value={passcode}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="passcode segment">
                    <div className="form-div passcode">
                        <button
                            type="submit"
                            value="send"
                            onClick={handleLogin}
                            className="button"
                            disabled={passcode.length < 4 || isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default PasscodePage
