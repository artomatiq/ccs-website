import "./ticket.css"
import { useEffect } from "react"
import PasscodePage from "./PasscodePage"
import TicketWorkflow from "./TicketWorkflow"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate, Navigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Routes, Route } from "react-router-dom"

const Ticket = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname !== "/ticket/login") return
        const scroll = () => {
            const footer = document.querySelector(".footer-container")
            if (!footer) return
            const footerTop =
                footer.getBoundingClientRect().top + window.scrollY
            const scrollTo = Math.max(0, footerTop - window.innerHeight)
            window.scrollTo({ top: scrollTo })
        }
        requestAnimationFrame(scroll)
    }, [location.pathname])

    useEffect(() => {
        if (!isAuthenticated && location.pathname !== "/ticket/login") {
            navigate("/ticket/login", { replace: true })
        }
    }, [isAuthenticated, location.pathname, navigate])

    return (
        <div className="quote-container ticket-container section">
            <Routes>
                <Route path="login" element={<PasscodePage />} />
                <Route
                    path="*"
                    element={
                        isAuthenticated ? (
                            <TicketWorkflow />
                        ) : (
                            <Navigate to="/ticket/login" replace />
                        )
                    }
                />
            </Routes>
        </div>
    )
}
export default Ticket
