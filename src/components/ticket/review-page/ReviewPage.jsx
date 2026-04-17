import { useState, useEffect } from "react"
import { useAuth } from "../../../auth/AuthContext"
import "./reviewPage.css"
import TicketOverlay from "../ticket-overlay/TicketOverlay"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function ReviewPage(props) {
    const { token, setToken, isAdmin, user } = useAuth()

    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [reviewForm, setReviewForm] = useState({})
    const [touched, setTouched] = useState({
        date: false,
        day: false,
        customerName: false,
        jobName: false,
        city: false,
        truckNo: false,
        start: false,
        stop: false,
    })
    const { dbTicket, setDbTicket } = props
    const navigate = useNavigate()

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

        // DATE VALIDATION
        if (cleanedForm.date) {
            const inputDate = new Date(cleanedForm.date)
            const today = new Date()
            const pastLimit = new Date()
            pastLimit.setDate(today.getDate() - 7)

            // normalize time
            inputDate.setHours(0, 0, 0, 0)
            today.setHours(0, 0, 0, 0)
            pastLimit.setHours(0, 0, 0, 0)

            if (inputDate > today) {
                errors.push("Date cannot be in the future.")
                cleanedForm.date = null
            } else if (inputDate < pastLimit) {
                errors.push("Ticket must be dated within the past week.")
                cleanedForm.date = null
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
            `/confirm-ticket/${dbTicket.id}`
        const res = await fetch(confirmUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cleanedForm),
        })
        if (!res.ok) {
            Swal.fire({
                text: "Failed to confirm ticket. Contact admin.",
                icon: "warning",
            })
            return
        }
        const data = await res.json()
        const result = await Swal.fire({
            text: data.message || "Ticket successfully processed.",
            icon: "success",
            confirmButtonText: "OK",
        })
        if (result.isConfirmed) {
            if (!isAdmin) {
                sessionStorage.removeItem("userToken")
                setToken(null)
            }
            setDbTicket(null)
            navigate(`/ticket/${user}/welcome`)
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
        const scroll = () => {
            setTimeout(() => {
                const review = document.querySelector(".review-wrapper")
                const header = document.querySelector(".header-container")
                if (!review || !header) return
                const reviewTop =
                    review.getBoundingClientRect().top + window.scrollY
                const headerHeight = header.offsetHeight
                window.scrollTo({
                    top: reviewTop - headerHeight,
                    behavior: "smooth",
                })
            }, 2000)
        }
        scroll()
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
                disabled={!Object.values(touched).every(Boolean) || isSubmitting}
            >
                Finalize
            </button>
        </div>
    )
}
