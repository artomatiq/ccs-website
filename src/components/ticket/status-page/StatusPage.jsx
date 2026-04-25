import "./statusPage.css"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const steps = [
    { key: "uploading", activeFrom: "awaiting-upload", doneAt: "uploaded", label: "uploading" },
    { key: "validating", activeFrom: "validating", doneAt: "validated", label: "validating" },
    { key: "extracting", activeFrom: "extracting", doneAt: "extracted", label: "extracting" },
]

const statusOrder = [
    "awaiting-upload",
    "uploaded",
    "validating",
    "validated",
    "extracting",
    "extracted",
]

export default function StatusPage({
    dbTicket,
    setDbTicket,
    isUploading,
    setIsUploading,
}) {
    const { token } = useAuth()
    const navigate = useNavigate()
    const [visibleSteps, setVisibleSteps] = useState([])
    const statusBoxRef = useRef(null)
    const [tick, setTick] = useState(0)
    const stepStartTick = useRef([-1, -1, -1])

    useEffect(() => {
        const statusBox = statusBoxRef.current
        if (!statusBox) return
        requestAnimationFrame(() => {
            if (window.innerWidth < 600) {
                const footer = document.querySelector(".footer-container")
                if (!footer) return
                const footerTop = footer.getBoundingClientRect().top + window.scrollY
                const scrollTo = Math.max(0, footerTop - window.innerHeight)
                window.scrollTo({ top: scrollTo })
            } else {
                const rect = statusBox.getBoundingClientRect()
                const scrollTo =
                    rect.top +
                    window.scrollY -
                    window.innerHeight / 2 +
                    rect.height / 2
                window.scrollTo({
                    top: scrollTo,
                    behavior: "smooth",
                })
            }
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 400)
        return () => clearInterval(interval)
    }, [])

    // TEMP: cycle through statuses to visualize UI
    useEffect(() => {
        let i = 0
        const interval = setInterval(() => {
            setDbTicket((prev) => ({ ...prev, status: statusOrder[i] }))
            i = (i + 1) % statusOrder.length
            if (i === 0) stepStartTick.current = [-1, -1, -1]
        }, 1500)
        return () => clearInterval(interval)
    }, [setDbTicket])

    useEffect(() => {
        const currentIndex = statusOrder.indexOf(dbTicket.status)
        steps.forEach((step, i) => {
            if (stepStartTick.current[i] !== -1) return
            if (currentIndex >= statusOrder.indexOf(step.activeFrom)) {
                stepStartTick.current[i] = tick
            }
        })
    }, [tick, dbTicket.status])

    useEffect(() => {
        if (!isUploading) return
        let attempts = 0
        const MAX_ATTEMPTS = 60
        const interval = setInterval(async () => {
            if (++attempts > MAX_ATTEMPTS) {
                clearInterval(interval)
                Swal.fire({
                    title: "Taking Too Long",
                    text: "Processing timed out. Please try again or contact support.",
                    icon: "error",
                    confirmButtonText: "OK",
                    customClass: {
                        container: "swal-container",
                        popup: "swal-popup",
                        title: "swal-title",
                        content: "swal-content",
                        confirmButton: "swal-confirm-button",
                    },
                }).then(() => {
                    setDbTicket({ status: "idle" })
                    setIsUploading(null)
                    navigate("../dash", { replace: true })
                })
                return
            }
            const url =
                process.env.REACT_APP_API_BASE_URL +
                `/get-ticket/${dbTicket.id}`
            try {
const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (res.status === 404) {
                    console.log("Ticket not in DB yet, continuing polling...")
                    return
                }
                const data = await res.json()
                if (!res.ok) {
                    clearInterval(interval)
                    throw new Error(`HTTP error: ${res.status}`)
                }
                if (data.status === "rejected") {
                    clearInterval(interval)
                    Swal.fire({
                        title: "Ticket Rejected",
                        text: "This ticket may be a duplicate or unreadable.",
                        icon: "warning",
                        confirmButtonText: "OK",
                        customClass: {
                            container: "swal-container",
                            popup: "swal-popup",
                            title: "swal-title",
                            content: "swal-content",
                            confirmButton: "swal-confirm-button",
                        },
                    }).then(() => {
                        setTimeout(() => {
                            setDbTicket({ status: "idle" })
                            setIsUploading(null)
                            navigate("../dash", { replace: true })
                        }, 2000)
                    })
                    return
                }
                if (data.status === "failed") {
                    clearInterval(interval)
                    Swal.fire({
                        title: "Processing Failed",
                        text: "Something went wrong. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                        customClass: {
                            container: "swal-container",
                            popup: "swal-popup",
                            title: "swal-title",
                            content: "swal-content",
                            confirmButton: "swal-confirm-button",
                        },
                    }).then(() => {
                        setTimeout(() => {
                            setDbTicket({ status: "idle" })
                            setIsUploading(null)
                            navigate("../dash", { replace: true })
                        }, 2000)
                    })
                    return
                }
                if (data.status === "extracted") {
                    clearInterval(interval)
                    setTimeout(() => {
                        setIsUploading(false)
                    }, 2000)
                }
                setDbTicket((prev) => ({
                    ...prev,
                    status: data.status,
                    text: data.extractedData,
                    confidence: data.extractionConfidence,
                    corners: data.extractionApex,
                    downloadUrl: data.presignedUrl,
                }))
            } catch (err) {
                console.error("Polling error:", err)
                clearInterval(interval)
                setIsUploading(false)
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [isUploading, dbTicket.id, setDbTicket, token, setIsUploading, navigate])

    useEffect(() => {
        const currentIndex = statusOrder.indexOf(dbTicket.status)

        setVisibleSteps((prev) => {
            return steps.map((step, i) => {
                const requiredIndex = statusOrder.indexOf(step.doneAt)

                if (currentIndex > requiredIndex) {
                    return { ...step, state: "done" }
                }

                if (currentIndex === requiredIndex) {
                    return { ...step, state: "loading" }
                }

                return { ...step, state: "pending" }
            })
        })
    }, [dbTicket.status])

    return (
        <div className="status-section" id="status-section">
            <div className="status-box" ref={statusBoxRef}>
                {visibleSteps.map((step, i) => {
                    const started = stepStartTick.current[i] !== -1
                    const elapsed = started ? tick - stepStartTick.current[i] : 0
                    const cycleComplete = elapsed >= 4
                    const showCheck = cycleComplete && step.state === "done"
                    const dotsCount = started && !showCheck ? elapsed % 4 : 0

                    return (
                        <div key={i} className="status-row">
                            <span>
                                {step.label}
                                {".".repeat(dotsCount)}
                            </span>
                            {showCheck && <span className="check">✔</span>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
