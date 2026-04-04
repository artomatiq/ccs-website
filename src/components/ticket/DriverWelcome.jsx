import { useEffect, useRef } from "react"
import "./driverWelcome.css"
import { useAuth } from "../../auth/AuthContext"
import UploadPage from "./UploadPage"
import StatusPage from "./StatusPage"
import ReviewPage from "./ReviewPage"

const DriverWelcome = (props) => {
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

    const { dbTicket, setDbTicket } = props
    const { user } = useAuth()

    const {setView} = props

    const handleClick = (e) => {
        setView(e.target.name)
    }

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
                    <button name="upload" onClick={handleClick} >Upload Ticket</button>
                </div>
            </div>
        </>
    )
}

export default DriverWelcome
