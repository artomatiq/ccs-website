import { useState, useEffect } from "react"
import "./ticketOverlay.css"
export default function TicketOverlay({ dbTicket }) {
    const [reviewForm, setReviewForm] = useState({})

    useEffect(() => {
        const form = Object.fromEntries(
            Object.keys(dbTicket.text).map((field) => [
                field,
                {
                    value: dbTicket.text?.[field] ?? null,
                    confidence: dbTicket.confidence?.[field] ?? null,
                    corner: dbTicket.corners?.[field] ?? null,
                },
            ]),
        )

        setReviewForm(form)
    }, [dbTicket])

    return <div></div>
}
