import { useState, useEffect } from "react"
import { useAuth } from "../../auth/AuthContext"
import "./reviewPage.css"
import imgUrl from "../../assets/60b65df1-392f-401f-91b9-dea5173562df.png"
import TicketOverlay from "./TicketOverlay"
import Swal from "sweetalert2"

export default function ReviewPage({ dbTicket, setDbTicket }) {
    const { token, setToken } = useAuth()
    const [imgLoaded, setImgLoaded] = useState(true)
    const [imgError, setImgError] = useState(false)
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
    const handleFinalize = async () => {
        const cleanedForm = Object.fromEntries(
            Object.entries(reviewForm).map(([key, obj]) => [
                key,
                obj?.value ?? null,
            ]),
        )
        const errors = []
        //DATE VALIDATION
        if (cleanedForm.date) {
            const today = new Date().toISOString().slice(0, 10)
            const pastLimit = new Date()
            pastLimit.setDate(pastLimit.getDate() - 7)
            const minDate = pastLimit.toISOString().slice(0, 10)
            if (cleanedForm.date > today) {
                errors.push("Date cannot be in the future.")
                cleanedForm.date = null
            } else if (cleanedForm.date < minDate) {
                errors.push("Ticket must be dated within the past week.")
                cleanedForm.date = null
            }
        }
        //TIME VALIDATION
        if (cleanedForm.start && cleanedForm.stop) {
            if (cleanedForm.start >= cleanedForm.stop) {
                errors.push("Start time must be earlier than stop time.")
                cleanedForm.start = null
                cleanedForm.stop = null
            }
        }
        //HANDLE ERRORS
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
            return
        }

        //API CALL
        const confirmUrl =
            process.env.REACT_APP_API_BASE_URL + `/confirm-ticket/${dbTicket.id}`
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
                text: "Failed to finalize ticket.",
                icon: "error",
            })
            return
        }
        const data = await res.json()
        Swal.fire({
            text: data.message || "Ticket successfully processed.",
            icon: "success",
        })
        setTimeout(() => {
            sessionStorage.removeItem("driverToken")
            setToken(null)
        }, 3000)
    }

    useEffect(() => {
        setTimeout(() => {
            const review = document.querySelector(".review-wrapper")
            const header = document.querySelector(".header-container")
            if (!review || !header) return
            const reviewTop =
                review.getBoundingClientRect().top + window.scrollY
            const headerHeight = header.offsetHeight
            const scrollTo = reviewTop - headerHeight
            window.scrollTo({
                top: scrollTo,
                behavior: "smooth",
            })
        }, 2000)
    }, [])

    if (imgError) {
        return <div>Failed to load image.</div>
    }
    return (
        <div className="review-wrapper">
            {imgLoaded ? (
                <>
                    <div className="ticket-wrapper">
                        <div className="ticket-number">
                            Ticket {dbTicket?.text?.ticketNumber}
                        </div>
                        <div className="ticket-box">
                            <img
                                src={imgUrl}
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
                        disabled={!Object.values(touched).every(Boolean)}
                    >
                        Finalize
                    </button>
                </>
            ) : (
                <div>Fetching ticket...</div>
            )}
        </div>
    )
}
