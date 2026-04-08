import { useEffect } from "react"
import { useAuth } from "../../auth/AuthContext"

export default function StatusPage({
    dbTicket,
    setDbTicket,
    isUploading,
    setIsUploading,
}) {
    const { token } = useAuth()
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
                setDbTicket((prev) => ({
                    ...prev,
                    status: data.status,
                    text: data.extractedData,
                    confidence: data.extractionConfidence,
                    corners: data.extractionApex,
                    downloadUrl: data.presignedUrl,
                }))
                if (["extracted", "rejected", "failed"].includes(data.status)) {
                    clearInterval(interval)
                    setIsUploading(false)
                }
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
