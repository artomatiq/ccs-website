import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { apiFetch } from "../../../api/apiFetch"
import { useTransitionNavigate } from "../../../contexts/TransitionContext"
import "./adminDash.css"

const AdminDash = ({ setDbTicket, setIsUploading }) => {
    const spanRef = useRef(null)
    const [extractedCount, setExtractedCount] = useState(0)
    const [firstExtractedId, setFirstExtractedId] = useState(null)
    const [populatedCount, setPopulatedCount] = useState(0)
    const [confirmedCount, setConfirmedCount] = useState(0)
    const [confirmHover, setConfirmHover] = useState(false)
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
        const fetchCounts = async () => {
            try {
                const url = process.env.REACT_APP_API_BASE_URL
                const [populatedRes, extractedRes] = await Promise.all([
                    apiFetch(`${url}/tickets?status=populated`, {}, logout),
                    apiFetch(`${url}/tickets?status=extracted`, {}, logout),
                ])
                const populatedData = await populatedRes.json()
                const extractedData = await extractedRes.json()
                const populatedTickets = populatedData.tickets ?? []
                const extractedTickets = extractedData.tickets ?? []
                setPopulatedCount(populatedTickets.filter((t) => t.status === "populated").length)
                setConfirmedCount(populatedTickets.filter((t) => t.status === "confirmed").length)
                setExtractedCount(extractedTickets.length)
                setFirstExtractedId(extractedTickets[0]?.ticketId ?? null)
            } catch (err) {
                console.error(err)
            }
        }
        fetchCounts()
        const timer = setTimeout(fetchCounts, 8000)
        return () => clearTimeout(timer)
    }, [logout])

    const handleConfirmNow = async (e) => {
        e.stopPropagation()
        if (!firstExtractedId) return
        try {
            const url = process.env.REACT_APP_API_BASE_URL
            const res = await apiFetch(`${url}/tickets/${firstExtractedId}`, {}, logout)
            const data = await res.json()
            setDbTicket({
                id: data.ticketId,
                status: data.status,
                text: data.extraction?.data,
                corners: data.extraction?.apex,
                downloadUrl: data.imageUrl,
            })
            setIsUploading(false)
            navigate("../review")
        } catch (err) {
            console.error(err)
        }
    }

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
                    {extractedCount > 0 && (
                        <div
                            className="admin-tile__tag admin-tile__tag--warn"
                            aria-label={`${extractedCount} tickets unconfirmed`}
                            onClick={handleConfirmNow}
                            onMouseEnter={() => setConfirmHover(true)}
                            onMouseLeave={() => setConfirmHover(false)}
                            style={{ cursor: "pointer" }}
                        >
                            {confirmHover ? (
                                "Confirm Now"
                            ) : (
                                <>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    {extractedCount} left unconfirmed
                                </>
                            )}
                        </div>
                    )}
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
                        <div className="admin-tile__tag admin-tile__tag--warn" aria-label={`${confirmedCount} still not populated`}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            {confirmedCount} still not populated
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminDash
