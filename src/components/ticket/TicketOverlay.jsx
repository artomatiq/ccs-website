import { useState, useEffect } from "react"
import "./ticketOverlay.css"
export default function TicketOverlay(props) {
    const [focused, setFocused] = useState("date")
    const { dbTicket, reviewForm, setReviewForm, touched, setTouched } = props

    useEffect(() => {
        const fieldOrder = [
            "date",
            "day",
            "customerName",
            "jobName",
            "city",
            "truckNo",
            "start",
            "stop",
        ]
        for (let field of fieldOrder) {
            const isEmpty = !reviewForm[field]?.value
            const isUntouched = !touched[field]

            if (isEmpty || isUntouched) {
                setFocused(field)
                return
            }
        }
        setFocused(null)
    }, [reviewForm, touched])

    useEffect(() => {
        if (!dbTicket?.text) return

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
    }, [dbTicket.text, dbTicket.confidence, dbTicket.corners, setReviewForm])

    const handleChange = (e) => {
        const { name, value } = e.target
        const hasValue = !!value.trim()
        setReviewForm((prev) => ({
            ...prev,
            [name]: {
                ...prev[name],
                value,
            },
        }))
        setTouched((prev) => ({
            ...prev,
            [name]: hasValue,
        }))
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        if (!value) return
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }))
    }

    return (
        <div className="ticket-overlay">
            {/* DATE */}
            {(() => {
                let value = reviewForm.date?.value ?? ""
                let inputType = "date"

                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    const d = new Date(value)
                    if (!isNaN(d)) {
                        value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                    } else {
                        value = ""
                    }
                }
                return (
                    <input
                        name="date"
                        className={`review-input ${!touched.date ? "unconfirmed" : ""} ${focused === "date" ? "focused" : ""}`}
                        type={inputType}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{
                            position: "absolute",
                            left: `53%`,
                            top: `3%`,
                            width: `9rem`,
                        }}
                    />
                )
            })()}

            {/* DAY */}
            <input
                name="day"
                className={`review-input ${!touched.day ? "unconfirmed" : ""} ${focused === "day" ? "focused" : ""}`}
                type="text"
                value={reviewForm.day?.value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                    position: "absolute",
                    left: `53%`,
                    top: `6.5%`,
                    width: `9rem`,
                }}
            />

            {/* CUSTOMER NAME */}
            <input
                name="customerName"
                className={`review-input ${!touched.customerName ? "unconfirmed" : ""} ${focused === "customerName" ? "focused" : ""}`}
                type="text"
                value={reviewForm.customerName?.value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                    position: "absolute",
                    left: `${reviewForm.customerName?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.customerName?.corner?.[1] * 100}%`,
                    width: `${Math.max((reviewForm.customerName?.value || "").length, 4) + 4}ch`,
                }}
            />

            {/* JOB NAME */}
            <input
                name="jobName"
                className={`review-input ${!touched.jobName ? "unconfirmed" : ""} ${focused === "jobName" ? "focused" : ""}`}
                type="text"
                value={reviewForm.jobName?.value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                    position: "absolute",
                    left: `${reviewForm.jobName?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.jobName?.corner?.[1] * 100}%`,
                    width: `${Math.max((reviewForm.jobName?.value || "").length, 4) + 4}ch`,
                }}
            />

            {/* CITY */}
            <input
                name="city"
                className={`review-input ${!touched.city ? "unconfirmed" : ""} ${focused === "city" ? "focused" : ""}`}
                type="text"
                value={reviewForm.city?.value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                    position: "absolute",
                    left: `${reviewForm.city?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.city?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `${Math.max((reviewForm.city?.value || "").length, 4) + 4}ch`,
                }}
            />

            {/* TRUCK NUMBER */}
            <input
                name="truckNo"
                className={`review-input ${!touched.truckNo ? "unconfirmed" : ""} ${focused === "truckNo" ? "focused" : ""}`}
                type="text"
                value={reviewForm.truckNo?.value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                    position: "absolute",
                    left: `${reviewForm.truckNo?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.truckNo?.corner?.[1] * 100}%`,
                    width: `4rem`,
                }}
            />

            {/* START */}
            {(() => {
                let raw = reviewForm.start?.value ?? ""
                let value = ""
                const match = raw.match(/(\d{1,2}):(\d{2})(am|pm)/i)
                if (match) {
                    let [, hour, minute, period] = match
                    hour = parseInt(hour)

                    if (period.toLowerCase() === "pm" && hour !== 12) hour += 12
                    if (period.toLowerCase() === "am" && hour === 12) hour = 0

                    value = `${String(hour).padStart(2, "0")}:${minute}`
                } else if (/^\d{2}:\d{2}$/.test(raw)) {
                    value = raw
                } else {
                    value = ""
                }
                return (
                    <input
                        name="start"
                        className={`review-input ${!touched.start ? "unconfirmed" : ""} ${focused === "start" ? "focused" : ""}`}
                        type="time"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{
                            position: "absolute",
                            left: `60%`,
                            top: `83.5%`,
                            width: `8rem`,
                        }}
                    />
                )
            })()}

            {/* STOP */}
            {(() => {
                let raw = reviewForm.stop?.value ?? ""
                let value = ""
                const match = raw.match(/(\d{1,2}):(\d{2})(am|pm)/i)
                if (match) {
                    let [, hour, minute, period] = match
                    hour = parseInt(hour)
                    if (period.toLowerCase() === "pm" && hour !== 12) hour += 12
                    if (period.toLowerCase() === "am" && hour === 12) hour = 0
                    value = `${String(hour).padStart(2, "0")}:${minute}`
                } else if (/^\d{2}:\d{2}$/.test(raw)) {
                    value = raw
                } else {
                    value = ""
                }
                return (
                    <input
                        name="stop"
                        className={`review-input ${!touched.stop ? "unconfirmed" : ""} ${focused === "stop" ? "focused" : ""}`}
                        type="time"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{
                            position: "absolute",
                            left: `60%`,
                            top: `87.5%`,
                            width: `8rem`,
                        }}
                    />
                )
            })()}
        </div>
    )
}
