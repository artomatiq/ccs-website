import { useState, useEffect } from "react"
import "./ticketOverlay.css"
export default function TicketOverlay({ dbTicket }) {
    const [reviewForm, setReviewForm] = useState({})
    const [focused, setFocused] = useState("date")
    const [touched, setTouched] = useState({
        date: false,
        day: false,
        customerName: false,
        jobName: false,
        city: false,
        truckNo: false,
        start: false,
        stop: false,
    })

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
                        className={`review-input ${!touched.date ? "unconfirmed" : ""} ${focused === "date" ? "focused" : ""}`}
                        type={inputType}
                        value={value}
                        onChange={(e) => handleChange("date", e.target.value)}
                        onBlur={() => {
                            setTouched((prev) => ({ ...prev, date: true }))
                            setFocused("day")
                        }}
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
                className={`review-input ${!touched.day ? "unconfirmed" : ""} ${focused === "day" ? "focused" : ""}`}
                type="text"
                value={reviewForm.day?.value ?? ""}
                onChange={(e) => handleChange("day", e.target.value)}
                onBlur={() => {
                    setTouched((prev) => ({ ...prev, day: true }))
                    setFocused("customerName")
                }}
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
                className={`review-input ${!touched.customerName ? "unconfirmed" : ""} ${focused === "customerName" ? "focused" : ""}`}
                type="text"
                value={reviewForm.customerName?.value ?? ""}
                onChange={(e) => handleChange("customerName", e.target.value)}
                onBlur={() => {
                    setTouched((prev) => ({ ...prev, customerName: true }))
                    setFocused("jobName")
                }}
                style={{
                    position: "absolute",
                    left: `${reviewForm.customerName?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.customerName?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `${Math.max((reviewForm.customerName?.value || "").length, 4) + 4}ch`,
                }}
            />

            {/* JOB NAME */}
            <input
                className={`review-input ${!touched.jobName ? "unconfirmed" : ""} ${focused === "jobName" ? "focused" : ""}`}
                type="text"
                value={reviewForm.jobName?.value ?? ""}
                onChange={(e) => handleChange("jobName", e.target.value)}
                onBlur={() => {
                    setTouched((prev) => ({ ...prev, jobName: true }))
                    setFocused("city")
                }}
                style={{
                    position: "absolute",
                    left: `${reviewForm.jobName?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.jobName?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `${Math.max((reviewForm.jobName?.value || "").length, 4) + 4}ch`,
                }}
            />

            {/* CITY */}
            <input
                className={`review-input ${!touched.city ? "unconfirmed" : ""} ${focused === "city" ? "focused" : ""}`}
                type="text"
                value={reviewForm.city?.value ?? ""}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => {
                    setTouched((prev) => ({ ...prev, city: true }))
                    setFocused("truckNo")
                }}
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
                className={`review-input ${!touched.truckNo ? "unconfirmed" : ""} ${focused === "truckNo" ? "focused" : ""}`}
                type="text"
                value={reviewForm.truckNo?.value ?? ""}
                onChange={(e) => handleChange("truckNumber", e.target.value)}
                onBlur={() => {
                    setTouched((prev) => ({ ...prev, truckNo: true }))
                    setFocused("start")
                }}
                style={{
                    position: "absolute",
                    left: `${reviewForm.truckNo?.corner?.[0] * 100 + 3}%`,
                    top: `${reviewForm.truckNo?.corner?.[1] * 100}%`,
                    height: `1rem`,
                    width: `4rem`,
                }}
            />

            {/* START */}
            {(() => {
                let raw = reviewForm.start?.value ?? ""
                let value = ""

                const match = raw.match(/(\d{1,2}):(\d{2})(am|pm)/i)
                if (match) {
                    let [_, hour, minute, period] = match
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
                        className={`review-input ${!touched.start ? "unconfirmed" : ""} ${focused === "start" ? "focused" : ""}`}
                        type="time"
                        value={value}
                        onChange={(e) => handleChange("start", e.target.value)}
                        onBlur={() => {
                            setTouched((prev) => ({ ...prev, start: true }))
                            setFocused("stop")
                        }}
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
                let raw = reviewForm.stop?.value ?? ""
                let value = ""

                const match = raw.match(/(\d{1,2}):(\d{2})(am|pm)/i)
                if (match) {
                    let [_, hour, minute, period] = match
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
                        className={`review-input ${!touched.stop ? "unconfirmed" : ""} ${focused === "stop" ? "focused" : ""}`}
                        type="time"
                        value={value}
                        onChange={(e) => handleChange("stop", e.target.value)}
                        onBlur={() => {
                            setTouched((prev) => ({ ...prev, stop: true }))
                            setFocused(null)
                        }}
                        style={{
                            position: "absolute",
                            left: `60%`,
                            top: `87.5%`,
                            height: `1rem`,
                            width: `8rem`,
                        }}
                    />
                )
            })()}
        </div>
    )
}
