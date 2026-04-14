import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./adminWelcome.css"

const AdminWelcome = () => {
    const spanRef = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            spanRef.current?.classList.add("show")
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const welcome = spanRef.current
        const dashboard = document.querySelector(".admin-dashboard")
        if (!welcome || !dashboard) return
        // Step 1: center Welcome in viewport
        requestAnimationFrame(() => {
            const rect = welcome.getBoundingClientRect()
            const scrollTo =
                rect.top +
                window.scrollY -
                window.innerHeight / 2 +
                rect.height / 2
            window.scrollTo({
                top: scrollTo,
                behavior: "smooth",
            })
            // Step 2: then scroll to dashboard
            const timer = setTimeout(() => {
                const dashboardTop =
                    dashboard.getBoundingClientRect().top + window.scrollY
                window.scrollTo({
                    top: dashboardTop,
                    behavior: "smooth",
                })
            }, 2000)
            return () => clearTimeout(timer)
        })
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
                    <button
                        name="process"
                        onClick={() => navigate("/ticket/admin/process")}
                    >
                        Process Tickets
                    </button>
                </div>
                <div className="upload-section">
                    <button
                        name="upload"
                        onClick={() => navigate("/ticket/admin/upload")}
                    >
                        Upload Tickets
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdminWelcome
