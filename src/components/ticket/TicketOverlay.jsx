import { useState, useEffect } from "react"
import "./ticketOverlay.css"
export default function TicketOverlay({ dbTicket }) {
    const [reviewForm, setReviewForm] = useState({})

    useEffect(() => {
        const form = Object.fromEntries(
            Object.keys(dbTicket.text)
                .filter((field) => field !== "ticketNumber")
                .map((field) => [
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

    const handleChange = (field, newValue) => {
        setReviewForm((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                value: newValue,
            },
        }))
    }

    return (
        <div className="ticket-overlay">
            {/* DATE */}
            {(() => {
                let value = reviewForm.date?.value ?? ""
                let inputType = "date"

                const d = new Date(value)
                if (!isNaN(d)) {
                    value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                } else value = ""

                return (
                    <input
                        className="review-input"
                        type={inputType}
                        value={value}
                        onChange={(e) => handleChange("date", e.target.value)}
                        style={{
                            position: "absolute",
                            left: `53%`,
                            top: `3%`,
                            height: `1rem`,
                            width: `9rem`,
                        }}
                    />
                )
            })()}

            {/* DAY */}
            <input
                className="review-input"
                type="text"
                value={reviewForm.day?.value ?? ""}
                onChange={(e) => handleChange("day", e.target.value)}
                style={{
                    position: "absolute",
                    left: `53%`,
                    top: `6.5%`,
                    height: `1rem`,
                    width: `9rem`,
                }}
            />

            {/* CUSTOMER NAME */}
            <input
                className="review-input"
                type="text"
                value={reviewForm.customerName?.value ?? ""}
                onChange={(e) => handleChange("customerName", e.target.value)}
                style={{
                    position: "absolute",
                    left: `${reviewForm.customerName?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.customerName?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `${Math.max((reviewForm.customerName?.value || "").length, 4) + 4}ch`
                }}
            />

            {/* JOB NAME */}
            <input
                className="review-input"
                type="text"
                value={reviewForm.jobName?.value ?? ""}
                onChange={(e) => handleChange("jobName", e.target.value)}
                style={{
                    position: "absolute",
                    left: `${reviewForm.jobName?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.jobName?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `${Math.max((reviewForm.jobName?.value || "").length, 4) + 4}ch`
                }}
            />

            {/* CITY */}
            <input
                className="review-input"
                type="text"
                value={reviewForm.city?.value ?? ""}
                onChange={(e) => handleChange("city", e.target.value)}
                style={{
                    position: "absolute",
                    left: `${reviewForm.city?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.city?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `${Math.max((reviewForm.city?.value || "").length, 4) + 4}ch`
                }}
            />

            {/* TRUCK NUMBER */}
            <input
                className="review-input"
                type="text"
                value={reviewForm.truckNo?.value ?? ""}
                onChange={(e) => handleChange("truckNumber", e.target.value)}
                style={{
                    position: "absolute",
                    left: `${reviewForm.truckNo?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.truckNo?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `4rem`
                }}
            />

            {/* START */}
            {(() => {
                let value = reviewForm.start?.value ?? ""
                let inputType = "time"

                const d = new Date(`1970-01-01T${value}`)
                if (!isNaN(d)) {
                    value = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
                } else value = ""

                return (
                    <input
                        className="review-input"
                        type={inputType}
                        value={value}
                        onChange={(e) => handleChange("start", e.target.value)}
                        style={{
                            position: "absolute",
                            left: `60%`,
                            top: `83.5%`,
                            height: `1rem`,
                            width: `8rem`,
                        }}
                    />
                )
            })()}

            {/* STOP */}
            {(() => {
                let value = reviewForm.stop?.value ?? ""
                let inputType = "time"

                const d = new Date(`1970-01-01T${value}`)
                if (!isNaN(d)) {
                    value = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
                } else value = ""

                return (
                    <input
                        className="review-input"
                        type={inputType}
                        value={value || 0}
                        onChange={(e) => handleChange("stop", e.target.value)}
                        style={{
                            position: "absolute",
                            left: `60%`,
                            top: `87.5%`,
                            height: `1rem`,
                            width: `8rem`
                        }}
                    />
                )
            })()}
        </div>
    )
}
