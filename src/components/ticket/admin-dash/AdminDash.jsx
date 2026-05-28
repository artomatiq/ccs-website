import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { apiFetch } from "../../../api/apiFetch"
import { useTransitionNavigate } from "../../../contexts/TransitionContext"
import "./adminDash.css"

const AdminDash = () => {
    const spanRef = useRef(null)
    const [populatedCount, setPopulatedCount] = useState(0)
    const [confirmedCount, setConfirmedCount] = useState(0)
    const navigate = useTransitionNavigate()
    const { logout } = useAuth()
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
                behavior: "instant",
            })
            // Step 2: then scroll to dashboard
            const timer = setTimeout(() => {
                const dashboardTop =
                    dashboard.getBoundingClientRect().top + window.scrollY
                window.scrollTo({
                    top: dashboardTop,
                    behavior: "smooth",
                })
            }, 2800)
            return () => clearTimeout(timer)
        })
    }, [])
    useEffect(() => {
        const fetchPopulatedCount = async () => {
            try {
                const url = process.env.REACT_APP_API_BASE_URL
                const res = await apiFetch(`${url}/tickets?status=populated`, {}, logout)
                const data = await res.json()
                const tickets = data.tickets ?? []
                setPopulatedCount(tickets.filter((t) => t.status === "populated").length)
                setConfirmedCount(tickets.filter((t) => t.status === "confirmed").length)
            } catch (err) {
                console.error(err)
            }
        }
        fetchPopulatedCount()
    }, [logout])

    return (
        <>
            <div className="title section segment">
                <span ref={spanRef} className="hide">
                    Hello Admin
                </span>
            </div>
            <div className="admin-dashboard">
                <div
                    className="admin-tile"
                    onClick={() => navigate("/ticket/admin/upload")}
                    role="button"
                    tabIndex={0}
                >
                    <div className="admin-tile__icon">
                        <i className="fa-solid fa-camera"></i>
                    </div>
                    <div className="admin-tile__label">Submit Ticket</div>
                    <div className="admin-tile__desc">
                        Photograph a paper ticket and<br />
                        review the extracted fields.
                    </div>
                </div>

                <div
                    className="admin-tile"
                    onClick={() => navigate("/ticket/admin/invoice")}
                    role="button"
                    tabIndex={0}
                >
                    <div className="admin-tile__icon">
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div className="admin-tile__label">Generate Invoice</div>
                    <div className="admin-tile__desc">
                        Roll up populated rows into a<br />
                        PDF invoice in Drive.
                    </div>
                    {populatedCount > 0 && (
                        <div className="admin-tile__tag" aria-label={`${populatedCount} unprocessed tickets`}>
                            <span className="dot"></span>
                            {populatedCount} ready
                        </div>
                    )}
                    {confirmedCount > 0 && (
                        <div className="admin-tile__tag admin-tile__tag--warn" aria-label={`${confirmedCount} tickets failed sheet write`}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            {confirmedCount} tickets failed sheet write
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminDash
