import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./adminWelcome.css"
import UploadPage from "./UploadPage"
import StatusPage from "./StatusPage"
import ReviewPage from "./ReviewPage"

const AdminWelcome = (props) => {
    const spanRef = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            spanRef.current?.classList.add("show")
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            const dashabord = document.querySelector(".admin-dashboard")
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

    const navigate = useNavigate()

    return (
        <>
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Welcome Admin
                </span>
            </div>
            <div className="admin-dashboard">
                <div className="process-section">
                    <button name="process" onClick={() => navigate("process")} >Process Tickets</button>
                </div>
                <div className="upload-section">
                    <button name="upload" onClick={() => navigate("upload")} >Upload Tickets</button>
                </div>
            </div>
        </>
    )
}

export default AdminWelcome
