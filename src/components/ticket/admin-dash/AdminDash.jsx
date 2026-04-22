import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../auth/AuthContext"
import "./adminDash.css"

const AdminDash = () => {
    const spanRef = useRef(null)
    const [populatedCount, setPopulatedCount] = useState(0)
    const navigate = useNavigate()
    const { token } = useAuth()
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
    useEffect(() => {
        const fetchPopulatedCount = async () => {
            try {
                const url = process.env.REACT_APP_API_BASE_URL
                const res = await fetch(`${url}/tickets?status=populated`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok)
                    throw new Error("Failed to fetch populated tickets")
                const data = await res.json()
                setPopulatedCount(data.tickets?.length ?? 0)
                console.log('there are ', data.tickets?.length, ' populated tickets')
            } catch (err) {
                console.error(err)
            }
        }
        fetchPopulatedCount()
    }, [])

    return (
        <>
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Welcome Admin
                </span>
            </div>
            <div className="admin-dashboard">
                <div className="upload-section">
                    <button
                        name="upload"
                        onClick={() => navigate("/ticket/admin/upload")}
                    >
                        Submit Tickets
                    </button>
                </div>
                <div className="dash-section">
                    <div className="button-wrapper">
                        <button
                            name="dash"
                            onClick={() => navigate("/ticket/admin/dash")}
                        >
                            Invoice Tickets
                        </button>
                        {populatedCount > 0 && (
                            <span
                                className="badge"
                                aria-label={`${populatedCount} unprocessed tickets`}
                            >
                                {populatedCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDash
