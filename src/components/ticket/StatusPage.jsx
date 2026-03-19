export default function StatusPage({ ticket, setTicket }) {
    const url = process.env.REACT_APP_API_BASE_URL + '/get-ticket' + ticket.id? ticket.id : ''
    return <div>StatusPage</div>;
}
