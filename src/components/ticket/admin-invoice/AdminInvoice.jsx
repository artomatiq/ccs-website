// src/ticket/pages/admin-invoice/AdminInvoice.jsx
import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../auth/AuthContext"
import "./adminInvoice.css"

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

export default function AdminInvoice() {
    const { token } = useAuth()
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [selectedDate, setSelectedDate] = useState("")
    const [previewTicket, setPreviewTicket] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [dots, setDots] = useState("")
    const [pdfUrl, setPdfUrl] = useState(null)

    function InvoicePdfView({ url, onBack }) {
        const embedUrl = url.replace("/view", "/preview")
        return (
            <div className="invoice-pdf-view">
                <button className="invoice-pdf-back" onClick={onBack}>
                    <i className="bx bx-arrow-back" />
                    Back
                </button>
                <iframe
                    src={embedUrl}
                    title="Generated Invoice"
                    className="invoice-pdf-frame"
                />
            </div>
        )
    }

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const url = process.env.REACT_APP_API_BASE_URL
                const res = await fetch(`${url}/tickets?status=populated`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) throw new Error("Failed to fetch tickets")
                const data = await res.json()
                setTickets(data.tickets ?? [])
            } catch (err) {
                console.error(err)
            }
        }
        fetchTickets()
    }, [token])

    useEffect(() => {
        if (!previewTicket) return
        const handleKey = (e) => {
            if (e.key === "Escape") setPreviewTicket(null)
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [previewTicket])

    const groups = useMemo(() => {
        return Object.entries(
            tickets.reduce((acc, t) => {
                const date = t.ticketDate ?? "Unknown"
                if (!acc[date]) acc[date] = []
                acc[date].push(t)
                return acc
            }, {}),
        ).sort(([a], [b]) => new Date(a) - new Date(b))
    }, [tickets])

    useEffect(() => {
        const invoicePage = document.querySelector(".invoice-page")
        if (!invoicePage) return
        requestAnimationFrame(() => {
            const timer = setTimeout(() => {
                const invoicePageTop =
                    invoicePage.getBoundingClientRect().top + window.scrollY
                window.scrollTo({
                    top: invoicePageTop - 30,
                    behavior: "smooth",
                })
            }, 1000)
            return () => clearTimeout(timer)
        })
    }, [])

    const availableDates = groups.map(([date]) => date)
    const earliestDate = availableDates[0]

    useEffect(() => {
        if (earliestDate && !selectedDate) setSelectedDate(earliestDate)
    }, [earliestDate, selectedDate])

    const selectedTickets = groups.find(([d]) => d === selectedDate)?.[1] ?? []

    const totalHours = selectedTickets.reduce(
        (sum, t) => sum + (t.hours ?? 0),
        0,
    )
    const totalAmount = selectedTickets.reduce(
        (sum, t) => sum + (t.amount ?? 0),
        0,
    )

    useEffect(() => {
        if (!isGenerating) {
            setDots("")
            return
        }
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
        }, 400)
        return () => clearInterval(interval)
    }, [isGenerating])

    const isEarliest = selectedDate === earliestDate

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const url = process.env.REACT_APP_API_BASE_URL
            const res = await fetch(`${url}/invoices/generate`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date: selectedDate }),
            })
            if (!res.ok) throw new Error("Invoice generation failed")
            const data = await res.json()
            setPdfUrl(data.pdfUrl)
        } catch (err) {
            console.error(err)
        } finally {
            setIsGenerating(false)
        }
    }

    if (pdfUrl) {
        return (
            <div className="invoice-page">
                <InvoicePdfView url={pdfUrl} onBack={() => setPdfUrl(null)} />
            </div>
        )
    }
    return (
        <div className="invoice-page">
            <button id="back-button" onClick={() => navigate(-1)}>
                <i className="bx bx-arrow-back" />
                Back
            </button>
            <div className="invoice-date-tabs" role="tablist">
                {availableDates.map((date) => (
                    <button
                        key={date}
                        role="tab"
                        aria-selected={date === selectedDate}
                        className={`invoice-date-tab ${
                            date === selectedDate ? "active" : ""
                        } ${date === earliestDate ? "earliest" : ""}`}
                        onClick={() => setSelectedDate(date)}
                    >
                        {date}
                    </button>
                ))}
            </div>

            <div className="invoice-previews">
                {selectedTickets.map((t) => (
                    <button
                        key={t.confirmedData.ticketNumber}
                        className="invoice-preview-btn"
                        onClick={() => setPreviewTicket(t)}
                    >
                        <img
                            src={`https://ccs-ticket-app.s3.amazonaws.com/${t.validatedKey}`}
                            alt={`Ticket ${t.confirmedData?.ticketNumber}`}
                            className="invoice-preview-img"
                        />
                    </button>
                ))}
            </div>

            <div className="invoice-totals">
                <div className="invoice-total-row">
                    <span>Total Hours:</span>
                    <strong>{totalHours.toFixed(2)}</strong>
                </div>
                <div className="invoice-total-row">
                    <span>Total Amount:</span>
                    <strong>{currencyFormatter.format(totalAmount)}</strong>
                </div>
            </div>

            <button
                className="invoice-generate-btn"
                id="invoice-generate-button"
                onClick={handleGenerate}
                disabled={!isEarliest || isGenerating}
            >
                {isGenerating ? `Generating${dots}` : "Generate Invoice"}
            </button>

            {previewTicket && (
                <div
                    className="invoice-modal-backdrop"
                    onClick={() => setPreviewTicket(null)}
                >
                    <button
                        className="invoice-modal-close"
                        onClick={() => setPreviewTicket(null)}
                        aria-label="Close preview"
                    >
                        ×
                    </button>
                    <img
                        src={`https://ccs-ticket-app.s3.amazonaws.com/${previewTicket.validatedKey}`}
                        alt={`Ticket ${previewTicket.confirmedData?.ticketNumber}`}
                        className="invoice-modal-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
