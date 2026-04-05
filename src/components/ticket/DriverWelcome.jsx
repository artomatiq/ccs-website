import { useEffect, useRef } from "react"
import "./driverWelcome.css"
import { useAuth } from "../../auth/AuthContext"
import { useNavigate } from "react-router-dom"

const DriverWelcome = () => {
    const spanRef = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            spanRef.current?.classList.add("show")
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            const dashabord = document.querySelector(".driver-dashboard")
            // const header = document.querySelector(".header-container")
            if (!dashabord) return
            const dashboardTop =
                dashabord.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
                top: dashboardTop,
                behavior: "smooth",
            })
        }, 2000)
    }, [])

    // const { dbTicket, setDbTicket } = props
    const { user } = useAuth()
    const navigate = useNavigate()

    return (
        <>
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Welcome {user}
                </span>
            </div>
            <div className="driver-dashboard">
                {/* <div className="process-section">
                    <button>Process Tickets</button>
                </div> */}
                <div className="upload-section">
                    <button name="upload" onClick={() => navigate("/ticket/driver/upload")}>Upload Ticket</button>
                </div>
            </div>
        </>
    )
}

export default DriverWelcome
