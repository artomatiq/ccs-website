// src/ticket/pages/admin-invoice/AdminInvoice.jsx
import { useEffect, useState, useMemo, lazy, Suspense } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { apiFetch } from "../../../api/apiFetch"
import { useTransitionNavigate, useScreenTransition } from "../../../contexts/TransitionContext"
import Swal from "sweetalert2"
import "./adminInvoice.css"

const InvoicePdfView = lazy(() => import("./InvoicePdfView"))

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

export default function AdminInvoice() {
    const { token, logout } = useAuth()
    const navigate = useTransitionNavigate()
    const { startTransition, finishTransition } = useScreenTransition()
    const [tickets, setTickets] = useState([])
    const [selectedDate, setSelectedDate] = useState("")
    const [previewTicket, setPreviewTicket] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    // const [pdfUrl, setPdfUrl] = useState("https://drive.google.com/file/d/1xzDcU_4SkX8drbnvOi2O6qpw57w49Cuo/view?usp=drive_link")
    const [pdfUrl, setPdfUrl] = useState(null)
    const [showPdf, setShowPdf] = useState(false)

    const isDesktop = useMemo(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches,
        [],
    )


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const url = process.env.REACT_APP_API_BASE_URL
                const res = await apiFetch(`${url}/tickets?status=populated`, {}, logout)

                const data = await res.json()
                setTickets(data.tickets ?? [])
            } catch (err) {
                console.error(err)
            }
        }
        fetchTickets()
    }, [logout])

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
        const id = requestAnimationFrame(() => {
            const invoicePage = document.querySelector(".invoice-page")
            if (!invoicePage) return
            const invoicePageTop =
                invoicePage.getBoundingClientRect().top + window.scrollY
            window.scrollTo({ top: invoicePageTop - 50 })
        })
        return () => cancelAnimationFrame(id)
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

    const isEarliest = selectedDate === earliestDate

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const url = process.env.REACT_APP_API_BASE_URL
            const res = await apiFetch(`${url}/invoices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: selectedDate,
                    ticketIds: selectedTickets.map((t) => t.ticketId),
                }),
            }, logout)

            const data = await res.json()
            if (!res.ok) {
                Swal.fire({
                    text: data.error || "Invoice generation failed.",
                    icon: "error",
                    confirmButtonText: "OK",
                    width: "22em",
                    customClass: {
                        container: "swal-container",
                        popup: "swal-popup",
                        title: "swal-title",
                        content: "swal-content",
                        confirmButton: "swal-confirm-button",
                    },
                })
                return
            }
            const PDF_TRANSITION = { fadeInDuration: 350, holdDuration: 0, fadeOutDuration: 400, blurFadeOutDuration: 400 }
            startTransition("", PDF_TRANSITION)
            setTimeout(() => {
                setPdfUrl(data.pdfUrl)
                setShowPdf(true)
                finishTransition()
            }, PDF_TRANSITION.fadeInDuration)
        } catch (err) {
            console.error(err)
            Swal.fire({
                text: "Invoice generation failed. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
                width: "22em",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
        } finally {
            setIsGenerating(false)
        }
    }

    if (showPdf && pdfUrl) {
        return (
            <div className="invoice-page">
                <Suspense fallback={<div>Loading PDF...</div>}>
                    <InvoicePdfView url={pdfUrl} token={token} isDesktop={isDesktop} />
                </Suspense>
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
                            src={t.imageUrl}
                            alt={`Ticket ${t.confirmedData?.ticketNumber}`}
                            className="invoice-preview-img"
                        />
                        {t.status === "confirmed" && (
                            <div className="invoice-preview-warn">
                                <i className="fa-solid fa-triangle-exclamation" />
                                <span>Sheet write failed</span>
                            </div>
                        )}
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
                <span className="scan scan-fwd" aria-hidden="true"></span>
                <span className="generate-inner">
                    {isGenerating ? (<>Generating<span className="dots-anim"></span></>) : "Generate Invoice"}
                </span>
            </button>

            {previewTicket && (
                <div
                    className="invoice-modal-backdrop"
                    onClick={() => setPreviewTicket(null)}
                >
                    <img
                        src={previewTicket.imageUrl}
                        alt={`Ticket ${previewTicket.confirmedData?.ticketNumber}`}
                        className="invoice-modal-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="invoice-modal-close"
                        onClick={() => setPreviewTicket(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}
