import { useState } from "react";
import UploadPage from "./UploadPage";
import StatusPage from "./StatusPage";
import ReviewPage from "./ReviewPage";

export default function TicketWorkflow() {
    const [ticket, setTicket] = useState({
        status: 'idle',
        extractedData: null
    })

    if (ticket.status === 'idle') return <UploadPage setTicket={setTicket} />
    else if (ticket.status === 'extracted') return <ReviewPage ticket={ticket} />
    else return <StatusPage ticket={ticket} setTicket={setTicket} />
}