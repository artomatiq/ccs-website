import { useEffect, useRef } from "react"
import "./driverWelcome.css"
import { useAuth } from "../../../auth/AuthContext"
import { useTransitionNavigate } from "../../../contexts/TransitionContext"

const DriverWelcome = () => {
    const spanRef = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            spanRef.current?.classList.add("show")
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const welcome = spanRef.current
        const dashboard = document.querySelector(".driver-dashboard")
        if (!welcome || !dashboard) return
        requestAnimationFrame(() => {
            const rect = welcome.getBoundingClientRect()
            const scrollTo =
                rect.top +
                window.scrollY -
                window.innerHeight / 2 +
                rect.height / 2
            window.scrollTo({ top: scrollTo, behavior: "instant" })
            const timer = setTimeout(() => {
                const dashboardTop =
                    dashboard.getBoundingClientRect().top + window.scrollY
                window.scrollTo({ top: dashboardTop, behavior: "smooth" })
            }, 2800)
            return () => clearTimeout(timer)
        })
    }, [])

    // const { dbTicket, setDbTicket } = props
    const { user } = useAuth()
    const navigate = useTransitionNavigate()

    return (
        <>
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Welcome {user}
                </span>
            </div>
            <div className="driver-dashboard">
                <div
                    className="driver-tile"
                    onClick={() => navigate("/ticket/driver/upload")}
                    role="button"
                    tabIndex={0}
                >
                    <div className="driver-tile__icon">
                        <i className="fa-solid fa-camera"></i>
                    </div>
                    <div className="driver-tile__label">Upload Ticket</div>
                    <div className="driver-tile__desc">
                        Photograph a paper ticket and<br />
                        submit it for processing.
                    </div>
                </div>
            </div>
        </>
    )
}

export default DriverWelcome
