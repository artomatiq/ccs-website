import "./ticket.css"
import "./passcodePage.css"
import { useState, useRef, useEffect } from "react"
import Swal from "sweetalert2"
import loginUser from "../../api/userLogin"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate } from "react-router-dom"

const PasscodePage = () => {
    const [passcode, setPasscode] = useState("")
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
        try {
            const res = await loginUser(passcode)
            const token = res.token
            if (!token) throw new Error(res.error)
            sessionStorage.setItem("userToken", token)
            setToken(token)
            navigate(`/ticket`, { replace: true })
        } catch (error) {
            Swal.fire({
                title: error.status || "",
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
    const resetViewport = () => {
        const meta = document.querySelector("meta[name=viewport]")
        if (!meta) return
        meta.setAttribute(
            "content",
            "width=device-width, initial-scale=1, maximum-scale=1",
        )
        setTimeout(() => {
            meta.setAttribute("content", "width=device-width, initial-scale=1")
        }, 50)

        setTimeout(() => {
            const scroll = () => {
                const footer = document.querySelector(".footer-container")
                if (!footer) return
                const footerTop =
                    footer.getBoundingClientRect().top + window.scrollY
                const scrollTo = Math.max(0, footerTop - window.innerHeight)
                window.scrollTo({ top: scrollTo })
            }
            requestAnimationFrame(scroll)
        }, 800)
    }
    return (
        <div
            className="quote-container ticket-container section"
            id="ticket-login-id"
        >
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Login
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
                            onBlur={resetViewport}
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
                            disabled={passcode.length < 4}
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default PasscodePage
