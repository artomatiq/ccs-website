import { useState } from "react"
import "./reviewPage.css"
import imgUrl from "../../assets/60b65df1-392f-401f-91b9-dea5173562df.png"
import TicketOverlay from "./TicketOverlay"

export default function ReviewPage({ dbTicket, setDbTicket }) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    if (imgError) {
        return <div>Failed to load image.</div>
    }
    return (
        <div>
            {!imgLoaded && <div>Fetching ticket...</div>}
            <img
                // src={dbTicket.downloadUrl}
                src={imgUrl}
                alt="ValidTicketImg"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
            />
        </div>
    )
}
