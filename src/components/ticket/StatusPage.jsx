import { useEffect } from "react"
import { useAuth } from "../../auth/AuthContext"

export default function StatusPage({ dbTicket, setDbTicket }) {
    const { token } = useAuth()
    useEffect(() => {
        if (!dbTicket?.id) return
        const interval = setInterval(async () => {
            const url =
                process.env.REACT_APP_API_BASE_URL +
                `/get-ticket/${dbTicket.id}`
            try {
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                if (!res.ok) {
                    clearInterval(interval)
                    throw new Error(`HTTP error: ${res.status}`)
                }
                setDbTicket((prev) => ({
                    ...prev,
                    status: data.status,
                    text: data.extractedData,
                    confidence: data.extractionConfidence,
                    corners: data.extractionApex,
                    downloadUrl: data.presignedUrl,
                }))
                if (
                    data.status === "extracted" ||
                    data.status === "rejected" ||
                    data.status === "failed"
                ) {
                    clearInterval(interval)
                }
            } catch (err) {
                console.error("Polling error:", err)
                clearInterval(interval)
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [dbTicket.id, setDbTicket])

    return <div>the status is {dbTicket.status}</div>
}
