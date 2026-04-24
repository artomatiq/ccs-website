import { useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminDash from "../admin-dash/AdminDash"
import DriverWelcome from "../driver-welcome/DriverWelcome"
import UploadPage from "../upload-page/UploadPage"
import StatusPage from '../status-page/StatusPage'
import ReviewPage from "../review-page/ReviewPage"
import AdminInvoice from "../admin-invoice/AdminInvoice"
// import testTicketImg from "../../../assets/60b65df1-392f-401f-91b9-dea5173562df.png"

export default function TicketWorkflow() {
    // const testTicket = {
    //     status: "extracted",
    //     id: "6eb90f94-b762-408e-9d54-5bc222f1e34b",
    //     text: {
    //         date: "01/14/2026",
    //         jobName: "Very Long Job Name",
    //         ticketNumber: "3893",
    //         stop: "",
    //         city: "Huntersville",
    //         start: "07:00",
    //         truckNo: "VV01",
    //         day: "Wednesday",
    //         customerName: "Very Long Customer",
    //     },
    //     confidence: {
    //         date: 93,
    //         jobName: 91,
    //         ticketNumber: 96,
    //         stop: 0,
    //         city: 95,
    //         start: 92,
    //         truckNo: 94,
    //         day: 94,
    //         customerName: 94,
    //     },
    //     corners: {
    //         date: [0.48, 0.03],
    //         jobName: [0.58, 0.27],
    //         stop: null,
    //         city: [0.73, 0.32],
    //         start: [0.52, 0.83],
    //         truckNo: [0.4, 0.37],
    //         day: [0.48, 0.06],
    //         customerName: [0.73, 0.23],
    //     },
    //     downloadUrl: testTicketImg,
    // }

    const [dbTicket, setDbTicket] = useState({
        status: "idle",
        extractedData: null,
    })
    // const [dbTicket, setDbTicket] = useState(testTicket)
    const { isAdmin, logout } = useAuth()
    // const [isUploading, setIsUploading] = useState(null)
    // const [isUploading, setIsUploading] = useState(true)
    const [isUploading, setIsUploading] = useState(null)

    return (
        <>
        <button id="logout-button" onClick={logout}>
            <i className="bx bx-log-out" />
            Sign out
        </button>
        <Routes>
            <Route
                index
                element={
                    <Navigate
                        to={isAdmin ? "admin/dash" : "driver/welcome"}
                        replace
                    />
                }
            />
            <Route path="admin">
                <Route
                    path="dash"
                    element={
                        isAdmin ? (
                            <AdminDash />
                        ) : (
                            <Navigate to="/ticket/login" />
                        )
                    }
                />
                <Route
                    path="upload"
                    element={
                        isUploading === null ? (
                            <UploadPage
                                isUploading={isUploading}
                                setIsUploading={setIsUploading}
                                setDbTicket={setDbTicket}
                            />
                        ) : (
                            <Navigate to="../status" replace />
                        )
                    }
                />
                <Route
                    path="status"
                    element={
                        isUploading === true ? (
                            <StatusPage
                                dbTicket={dbTicket}
                                setDbTicket={setDbTicket}
                                isUploading={isUploading}
                                setIsUploading={setIsUploading}
                            />
                        ) : isUploading === null ? (
                            <Navigate to="../upload" replace />
                        ) : (
                            <Navigate to="../review" replace />
                        )
                    }
                />
                <Route
                    path="review"
                    element={
                        isUploading === false ? (
                            <ReviewPage
                                dbTicket={dbTicket}
                                setDbTicket={setDbTicket}
                            />
                        ) : isUploading === null ? (
                            <Navigate to="../upload" replace />
                        ) : (
                            <Navigate to="../status" replace />
                        )
                    }
                />
                <Route
                    path="invoice"
                    element={
                        isAdmin ? (
                            <AdminInvoice />
                        ) : (
                            <Navigate to="/ticket/login" />
                        )
                    }
                />
            </Route>
            <Route path="driver">
                <Route
                    path="welcome"
                    element={
                        !isAdmin ? <DriverWelcome /> : <Navigate to="../" />
                    }
                />
                <Route
                    path="upload"
                    element={
                        isUploading === null ? (
                            <UploadPage
                                isUploading={isUploading}
                                setIsUploading={setIsUploading}
                                setDbTicket={setDbTicket}
                            />
                        ) : (
                            <Navigate to="../status" replace />
                        )
                    }
                />
                <Route
                    path="status"
                    element={
                        isUploading === true ? (
                            <StatusPage
                                dbTicket={dbTicket}
                                setDbTicket={setDbTicket}
                                isUploading={isUploading}
                                setIsUploading={setIsUploading}
                            />
                        ) : isUploading === null ? (
                            <Navigate to="../upload" replace />
                        ) : (
                            <Navigate to="../review" replace />
                        )
                    }
                />
                <Route
                    path="review"
                    element={
                        isUploading === false ? (
                            <ReviewPage
                                dbTicket={dbTicket}
                                setDbTicket={setDbTicket}
                            />
                        ) : isUploading === null ? (
                            <Navigate to="../upload" replace />
                        ) : (
                            <Navigate to="../status" replace />
                        )
                    }
                />
            </Route>
        </Routes>
        </>
    )
}
