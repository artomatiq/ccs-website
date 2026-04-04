import { useState } from "react"
import { useAuth } from "../../auth/AuthContext"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminWelcome from "./AdminWelcome"
import AdminProcess from "./AdminProcess"
import DriverWelcome from "./DriverWelcome"
import UploadPage from "./UploadPage"
import StatusPage from "./StatusPage"
import ReviewPage from "./ReviewPage"

export default function TicketWorkflow() {
    const testTicket = {
        status: "extracted",
        id: "6eb90f94-b762-408e-9d54-5bc222f1e34b",
        text: {
            date: "01/14/2026",
            jobName: "# 9566",
            ticketNumber: "3893",
            stop: "",
            city: "Huntersville",
            start: "07:00",
            truckNo: "VV01",
            day: "Wednesday",
            customerName: "Faulconer",
        },
        confidence: {
            date: 93,
            jobName: 91,
            ticketNumber: 96,
            stop: 0,
            city: 95,
            start: 92,
            truckNo: 94,
            day: 94,
            customerName: 94,
        },
        corners: {
            date: [0.48, 0.03],
            jobName: [0.58, 0.27],
            stop: null,
            city: [0.73, 0.32],
            start: [0.52, 0.83],
            truckNo: [0.4, 0.37],
            day: [0.48, 0.06],
            customerName: [0.73, 0.23],
        },
        downloadUrl:
            "https://ccs-ticket-app.s3.us-east-1.amazonaws.com/raw/VV02/6eb90f94-b762-408e-9d54-5bc222f1e34b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIATTJC4ITVPYJPHIIM%2F20260323%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260323T230847Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIC5m1t8xQdZUfE3ImmmGC8r1zk3Jr4abo%2FJ%2FUMFrvrb6AiAnsVEE8X2%2BIrCBvDYMT8ee5y17b3oCCjcxbvCIz6rNKyrsAwiI%2F%2F%2F%2...",
    }

    //   const [dbTicket, setDbTicket] = useState({
    //     status: "idle",
    //     extractedData: null,
    //   });

    const { isAdmin } = useAuth()
    const [isUploading, setIsUploading] = useState(false)
    const [dbTicket, setDbTicket] = useState(testTicket)

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         spanRef.current?.classList.add("show")
    //     }, 300)

    //     return () => clearTimeout(timer)
    // }, [])

    return (
        <Routes>
            <Route
                index
                element={
                    <Navigate
                        to={isAdmin ? "admin/welcome" : "driver/welcome"}
                        replace
                    />
                }
            />
            <Route path="admin">
                <Route path="welcome" element={isAdmin ? <AdminWelcome /> : <Navigate to="../" />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="status" element={<StatusPage />} />
            </Route>
            <Route path="driver">
                <Route path="welcome" element={!isAdmin ? <DriverWelcome /> : <Navigate to="../" />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="status" element={<StatusPage />} />
            </Route>
        </Routes>
    )
}
