import "./statusPage.css"
import { useEffect, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function StatusPage({
    dbTicket,
    setDbTicket,
    isUploading,
    setIsUploading,
}) {
    const { token } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (!isUploading) return
        return
        const interval = setInterval(async () => {
            const url =
                process.env.REACT_APP_API_BASE_URL +
                `/get-ticket/${dbTicket.id}`
            try {
                console.log("Polling token:", token)
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
                            navigate("../welcome", { replace: true })
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
                            navigate("../welcome", { replace: true })
                        }, 2000)
                    })
                    return
                }
                if (data.status === "extracted") {
                    clearInterval(interval)
                    setTimeout(() => {
                        setIsUploading(false)
                    }, 2000);
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

    const steps = [
        { key: "uploading", doneAt: "uploaded", label: "uploading..." },
        { key: "validating", doneAt: "validated", label: "validating..." },
        { key: "extracting", doneAt: "extracted", label: "extracting..." },
    ]

    const statusOrder = [
        "awaiting-upload",
        "uploaded",
        "validating",
        "validated",
        "extracting",
        "extracted",
    ]

    const [visibleSteps, setVisibleSteps] = useState([])

    useEffect(() => {
        let cancelled = false
        const run = async () => {
            const newSteps = []
            const currentIndex = statusOrder.indexOf(dbTicket.status)

            for (let i = 0; i < steps.length; i++) {
                newSteps.push({ ...steps[i], state: "loading" })
                setVisibleSteps([...newSteps])
                // minimum loader time
                await new Promise((r) => setTimeout(r, 1000))
                if (cancelled) return
                const requiredIndex = statusOrder.indexOf(steps[i].doneAt)
                if (currentIndex >= requiredIndex) {
                    newSteps[i].state = "done"
                } else {
                    newSteps[i].state = "pending"
                    setVisibleSteps([...newSteps])
                    return
                }
                setVisibleSteps([...newSteps])
                // pause before next step
                await new Promise((r) => setTimeout(r, 1000))
                if (cancelled) return
            }
        }
        run()
        return () => {
            cancelled = true
        }
    }, [dbTicket.status])

    return (
        <div className="status-section" id="status-section">
            <div className="status-box">
                {visibleSteps.map((step, i) => (
                    <div key={i} className="status-row">
                        <span>{step.label}</span>
                        {step.state === "loading" && (
                            <span className="loader" />
                        )}
                        {step.state === "done" && (
                            <span className="check">✔</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
