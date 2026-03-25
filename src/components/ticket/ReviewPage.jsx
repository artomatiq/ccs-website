import { useState, useEffect } from "react"
import "./reviewPage.css"
import imgUrl from "../../assets/60b65df1-392f-401f-91b9-dea5173562df.png"
import TicketOverlay from "./TicketOverlay"

export default function ReviewPage({ dbTicket, setDbTicket }) {
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

    const handleConfirm = async () => {
        
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
                            <TicketOverlay dbTicket={dbTicket} reviewForm={reviewForm} setReviewForm={setReviewForm} touched={touched} setTouched={setTouched}/>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="button"
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
