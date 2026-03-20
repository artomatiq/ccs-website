import { useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function StatusPage({ ticket, setTicket }) {
  const { token } = useAuth();
  useEffect(() => {
    if (!ticket?.id) return;
    const interval = setInterval(async () => {
      const url =
        process.env.REACT_APP_API_BASE_URL + `/get-ticket/${ticket.id}`;
      try {
        const res = await fetch(url, {
          headers: {Authorization: `Bearer ${token}`}
        });
        const data = await res.json();
        if (!res.ok) {
          clearInterval(interval);
          throw new Error(`HTTP error: ${res.status}`);
        }
        setTicket((prev) => ({
          ...prev,
          status: data.status,
          extractedData: data.extractedData || prev.extractedData,
        }));

        if (
          data.status === "extracted" ||
          data.status === "rejected" ||
          data.status === "failed"
        ) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [ticket.id, setTicket]);

  return <div>the status is {ticket.status}</div>;
}
