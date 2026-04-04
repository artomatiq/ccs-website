import "./ticket.css"
import { useEffect } from "react"
import PasscodePage from "./PasscodePage"
import TicketWorkflow from "./TicketWorkflow"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate, Navigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Routes, Route } from "react-router-dom"

const Ticket = () => {
    useEffect(() => {
        const button = document.querySelector(".ticket-button.nav-button")
        const element = document.querySelector(".ticket-container")
        const scroll = () => window.scrollTo(0, element.offsetTop)
        if (element) {
            scroll()
            if (button) button.addEventListener("click", scroll)
            return () => {
                if (button) button.removeEventListener("click", scroll)
            }
        }
    }, [])
    // const isMobile = true ///Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

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

    // return isMobile ? (
    //     <div className="quote-container ticket-container section" id="about-id">
    //         {/* <div className="title section segment">
    //             {isAdmin && <span className="hide">Welcome</span>}
    //             {!isAdmin && <span className="hide">Submit Hauling Ticket</span>}
    //         </div> */}
    //         {isAuthenticated ? <TicketWorkflow /> : <PasscodePage />}
    //     </div>
    // ) : (
    //     <div>
    //         <h3>Please use a smartphone.</h3>
    //     </div>
    // )
}
export default Ticket
