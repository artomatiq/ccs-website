import { useState, useEffect } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { apiFetch } from "../../../api/apiFetch"
import "./reviewPage.css"
import TicketOverlay from "../ticket-overlay/TicketOverlay"
import { useTransitionNavigate } from "../../../contexts/TransitionContext"
import Swal from "sweetalert2"

const FLEET = ["VV01", "VV02"]
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const uncapWords = (s) => s.split(/\s+/).filter((w) => /^[a-z]/.test(w))

export default function ReviewPage(props) {
    const { isAdmin, user, logout } = useAuth()

    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [reviewForm, setReviewForm] = useState({})
    const [touched, setTouched] = useState({
        date: false,
        day: false,
        customerName: false,
        jobName: false,
        // city: false,
        truckNo: false,
        start: false,
        stop: false,
    })
    const { dbTicket, setDbTicket } = props
    const navigate = useTransitionNavigate()

    const handleFinalize = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        const cleanedForm = Object.fromEntries(
            Object.entries(reviewForm).map(([key, obj]) => [
                key,
                obj?.value ?? null,
            ]),
        )
        const errors = []

        // REQUIRED FIELDS
        const REQUIRED_FIELDS = ["ticketNumber", "date", "day", "customerName", "jobName", "start", "stop", "truckNo"]
        const missing = REQUIRED_FIELDS.filter((k) => typeof cleanedForm[k] !== "string" || !cleanedForm[k].trim())
        if (missing.length) {
            errors.push(`Missing required fields: ${missing.join(", ")}`)
        }

        // DATE VALIDATION
        if (cleanedForm.date) {
            const [yyyy, mm, dd] = cleanedForm.date.split("-").map(Number)
            const dateObj = new Date(Date.UTC(yyyy, mm - 1, dd))
            const isRealDate =
                dateObj.getUTCFullYear() === yyyy &&
                dateObj.getUTCMonth() === mm - 1 &&
                dateObj.getUTCDate() === dd

            if (!isRealDate) {
                errors.push("Date is not a valid calendar date.")
                cleanedForm.date = null
            } else {
                const now = new Date()
                const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
                const ticketUTC = dateObj.getTime()
                const dayMs = 24 * 60 * 60 * 1000
                if (ticketUTC > todayUTC) {
                    errors.push("Date cannot be in the future.")
                    cleanedForm.date = null
                } else if (ticketUTC < todayUTC - 7 * dayMs) {
                    errors.push("Ticket must be dated within the past week.")
                    cleanedForm.date = null
                } else if (cleanedForm.day) {
                    const expectedDay = DAY_NAMES[dateObj.getUTCDay()]
                    if (cleanedForm.day.toLowerCase() !== expectedDay.toLowerCase()) {
                        errors.push(`'${cleanedForm.day}' doesn't match date (expected ${expectedDay}).`)
                        cleanedForm.day = null
                    }
                }
            }
        }

        // TRUCK VALIDATION
        if (cleanedForm.truckNo && !FLEET.includes(cleanedForm.truckNo)) {
            errors.push(`'${cleanedForm.truckNo}' is not a valid truck number.`)
            cleanedForm.truckNo = null
        }

        // CAPITALIZATION
        for (const [key, label] of [["customerName", "Customer name"], ["jobName", "Job name"]]) {
            if (cleanedForm[key]) {
                const bad = uncapWords(cleanedForm[key])
                if (bad.length) {
                    errors.push(`${label} has uncapitalized words: ${bad.join(", ")}.`)
                    cleanedForm[key] = null
                }
            }
        }

        // TIME VALIDATION
        if (cleanedForm.start && cleanedForm.stop) {
            if (cleanedForm.start >= cleanedForm.stop) {
                errors.push("Start time must be earlier than stop time.")
                cleanedForm.start = null
                cleanedForm.stop = null
            }
        }
        // HANDLE ERRORS
        if (errors.length > 0) {
            Swal.fire({
                html: errors.join("<br>"),
                icon: "warning",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
            setReviewForm((prev) => {
                const updated = { ...prev }
                Object.keys(cleanedForm).forEach((key) => {
                    if (cleanedForm[key] === null && prev[key]) {
                        updated[key] = {
                            ...prev[key],
                            value: null,
                        }
                    }
                })
                return updated
            })
            setTouched((prev) => {
                const updated = { ...prev }
                Object.keys(cleanedForm).forEach((key) => {
                    if (cleanedForm[key] === null) {
                        updated[key] = false
                    }
                })
                return updated
            })
            setIsSubmitting(false)
            return
        }
        // API CALL
        const confirmUrl =
            process.env.REACT_APP_API_BASE_URL +
            `/tickets/${dbTicket.id}/confirm`
        let res
        try {
            res = await apiFetch(confirmUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanedForm),
            }, logout)
        } catch (err) {
            Swal.fire({
                text: "Failed to confirm ticket. Contact admin.",
                icon: "warning",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
            setIsSubmitting(false)
            return
        }
        const data = await res.json()
        setIsSubmitting(false)
        setIsConfirmed(true)
        const result = await Swal.fire({
            text: data.message || "Ticket successfully processed.",
            icon: "success",
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
        if (result.isConfirmed) {
            if (!isAdmin) {
                logout()
            }
            navigate(`/ticket/${user}/dash`)
        }
    }
    // Reset loading state when new image arrives
    useEffect(() => {
        if (dbTicket?.downloadUrl) {
            setImgLoaded(false)
            setImgError(false)
        }
    }, [dbTicket?.downloadUrl])
    // Scroll
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            const review = document.querySelector(".review-wrapper")
            const header = document.querySelector(".header-container")
            if (!review || !header) return
            const reviewTop =
                review.getBoundingClientRect().top + window.scrollY
            const headerHeight = header.offsetHeight
            window.scrollTo({ top: reviewTop - headerHeight })
        })
        return () => cancelAnimationFrame(id)
    }, [])
    //GUARDS
    if (!dbTicket?.downloadUrl) {
        return <div>Fetching ticket...</div>
    }
    if (imgError) {
        return <div>Failed to load image.</div>
    }
    return (
        <div className="review-wrapper">
            {!imgLoaded && <div>Loading image...</div>}

            <div className="ticket-wrapper">
                <div className="ticket-number">
                    Ticket {dbTicket?.text?.ticketNumber}
                </div>

                <div className="ticket-box">
                    <img
                        src={dbTicket.downloadUrl}
                        alt="ValidTicketImg"
                        className="ticket-image"
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />

                    <TicketOverlay
                        dbTicket={dbTicket}
                        reviewForm={reviewForm}
                        setReviewForm={setReviewForm}
                        touched={touched}
                        setTouched={setTouched}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={handleFinalize}
                className="button"
                id="finalize-button"
                disabled={!Object.values(touched).every(Boolean) || isSubmitting || isConfirmed}
            >
                <span className="scan scan-fwd" aria-hidden="true"></span>
                <span className="finalize-inner">
                    {isSubmitting ? (
                        <>
                            Finalizing
                            <span className="dots-anim"></span>
                        </>
                    ) : (
                        "Finalize"
                    )}
                </span>
            </button>
        </div>
    )
}
