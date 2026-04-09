import { useEffect } from "react"
import { useAuth } from "../../auth/AuthContext"
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
                        setDbTicket({ status: "idle" })
                        setIsUploading(null)
                        navigate("../welcome", { replace: true })
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
                        setDbTicket({ status: "idle" })
                        setIsUploading(null)
                        navigate("../welcome", { replace: true })
                    })
                    return
                }
                if (data.status === "extracted") {
                    clearInterval(interval)
                    setIsUploading(false)
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
    }, [isUploading, dbTicket.id, setDbTicket, token, setIsUploading])

    return <div>the status is {dbTicket.status}</div>
}
