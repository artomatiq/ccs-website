import { useState, useEffect } from "react"
import "./reviewPage.css"
import imgUrl from "../../assets/60b65df1-392f-401f-91b9-dea5173562df.png"
import TicketOverlay from "./TicketOverlay"

export default function ReviewPage({ dbTicket, setDbTicket }) {
    const [imgLoaded, setImgLoaded] = useState(true)
    const [imgError, setImgError] = useState(false)

    const handleConfirm = async (e) => {
        e.preventDefault()
    }

    useEffect( () => {
        const element = document.querySelector(".review-wrapper")
        const scroll = () => window.scrollTo(0, element.offsetTop)
        if (element) scroll()
    }, [])

    if (imgError) {
        return <div>Failed to load image.</div>
    }
    return (
        <div className="review-wrapper">
            {!imgLoaded && <div>Fetching ticket...</div>}
            {imgLoaded && (
                <div className="ticket-container">
                    <img
                        src={imgUrl}
                        alt="ValidTicketImg"
                        className="ticket-image"
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                    <TicketOverlay dbTicket={dbTicket} />
                </div>
            )}
            <button
                type="button"
                onClick={handleConfirm}
                className="button"
                // disabled={!attachment}
            >
                Submit
            </button>
        </div>
    )
}
