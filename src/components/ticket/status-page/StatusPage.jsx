import "./statusPage.css"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import { useScreenTransition, NAV_TRANSITION_CONFIG } from "../../../contexts/TransitionContext"
import Swal from "sweetalert2"

const steps = [
    { key: "uploading", activeFrom: "awaiting-upload", doneAt: "uploaded", label: "uploading" },
    { key: "validating", activeFrom: "validating", doneAt: "validated", label: "validating" },
    { key: "extracting", activeFrom: "extracting", doneAt: "extracted", label: "extracting" },
]

const statusOrder = [
    "awaiting-upload",
    "uploaded",
    "validating",
    "validated",
    "extracting",
    "extracted",
]

export default function StatusPage({
    dbTicket,
    setDbTicket,
    isUploading,
    setIsUploading,
}) {
    const { token, logout } = useAuth()
    const navigate = useNavigate()
    const { startTransition, finishTransition } = useScreenTransition()
    const [visibleSteps, setVisibleSteps] = useState([])
    const statusBoxRef = useRef(null)
    const [tick, setTick] = useState(0)
    const stepStartTick = useRef([-1, -1, -1])
    const checkmarkShownAt = useRef(null)
    const navigationTriggered = useRef(false)

    useEffect(() => {
        const statusBox = statusBoxRef.current
        if (!statusBox) return
        requestAnimationFrame(() => {
            if (window.innerWidth < 600) {
                const footer = document.querySelector(".footer-container")
                if (!footer) return
                const footerTop = footer.getBoundingClientRect().top + window.scrollY
                const scrollTo = Math.max(0, footerTop - window.innerHeight)
                window.scrollTo({ top: scrollTo })
            } else {
                const rect = statusBox.getBoundingClientRect()
                const scrollTo =
                    rect.top +
                    window.scrollY -
                    window.innerHeight / 2 +
                    rect.height / 2
                window.scrollTo({
                    top: scrollTo,
                    behavior: "smooth",
                })
            }
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 500)
        return () => clearInterval(interval)
    }, [])

    // // TEMP: cycle through statuses to visualize UI
    // useEffect(() => {
    //     let i = 0
    //     const interval = setInterval(() => {
    //         setDbTicket((prev) => ({ ...prev, status: statusOrder[i] }))
    //         i = (i + 1) % statusOrder.length
    //         if (i === 0) stepStartTick.current = [-1, -1, -1]
    //     }, 1500)
    //     return () => clearInterval(interval)
    // }, [setDbTicket])

    const lastStepStartTick = useRef(null)

    useEffect(() => {
        const currentIndex = statusOrder.indexOf(dbTicket.status)
        for (let i = 0; i < steps.length; i++) {
            if (stepStartTick.current[i] !== -1) continue
            if (currentIndex < statusOrder.indexOf(steps[i].activeFrom)) continue
            if (lastStepStartTick.current !== null && tick - lastStepStartTick.current < 4) break
            stepStartTick.current[i] = tick
            lastStepStartTick.current = tick
            break
        }

        // Navigate once extracting checkmark has been visible for 1.5s
        if (navigationTriggered.current) return
        const extractStartTick = stepStartTick.current[2]
        if (extractStartTick === -1) return
        if (dbTicket.status !== "extracted") return
        const elapsed = tick - extractStartTick
        if (elapsed < 4) return  // checkmark not shown yet

        if (checkmarkShownAt.current === null) {
            checkmarkShownAt.current = Date.now()
        }
        if (Date.now() - checkmarkShownAt.current < 1500) return

        navigationTriggered.current = true
        startTransition("", NAV_TRANSITION_CONFIG)
        setTimeout(() => {
            setIsUploading(false)
            navigate("../review", { replace: true })
            finishTransition()
        }, NAV_TRANSITION_CONFIG.fadeInDuration)
    }, [tick, dbTicket.status, startTransition, finishTransition, navigate, setIsUploading])

    useEffect(() => {
        if (!isUploading) return
        let attempts = 0
        const MAX_ATTEMPTS = 60
        const interval = setInterval(async () => {
            if (++attempts > MAX_ATTEMPTS) {
                clearInterval(interval)
                Swal.fire({
                    title: "Taking Too Long",
                    text: "Processing timed out. Please try again or contact support.",
                    icon: "error",
                    confirmButtonText: "OK",
                    customClass: {
                        container: "swal-container",
                        popup: "swal-popup",
                        title: "swal-title",
                        content: "swal-content",
                        confirmButton: "swal-confirm-button",
                    },
                }).then(() => {
                    startTransition("", NAV_TRANSITION_CONFIG)
                    setTimeout(() => {
                        setDbTicket({ status: "idle" })
                        setIsUploading(null)
                        navigate("../dash", { replace: true })
                        finishTransition()
                    }, NAV_TRANSITION_CONFIG.fadeInDuration)
                })
                return
            }
            const url =
                process.env.REACT_APP_API_BASE_URL +
                `/tickets/${dbTicket.id}`
            try {
const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (res.status === 401 || res.status === 403) {
                    clearInterval(interval)
                    logout()
                    return
                }
                if (res.status === 404) {
                    console.log("Ticket not in DB yet, continuing polling...")
                    return
                }
                const data = await res.json()
                if (!res.ok) {
                    clearInterval(interval)
                    throw new Error(`HTTP error: ${res.status}`)
                }
                if (data.status === "rejected") {
                    clearInterval(interval)
                    Swal.fire({
                        title: "Ticket Rejected",
                        text: data.statusMessage || "This ticket could not be processed.",
                        icon: "warning",
                        confirmButtonText: "OK",
                        width: "22em",
                        customClass: {
                            container: "swal-container",
                            popup: "swal-popup",
                            title: "swal-title",
                            content: "swal-content",
                            confirmButton: "swal-confirm-button",
                        },
                    }).then(() => {
                        startTransition("", NAV_TRANSITION_CONFIG)
                        setTimeout(() => {
                            setDbTicket({ status: "idle" })
                            setIsUploading(null)
                            navigate("../dash", { replace: true })
                            finishTransition()
                        }, NAV_TRANSITION_CONFIG.fadeInDuration)
                    })
                    return
                }
                if (data.status === "failed") {
                    clearInterval(interval)
                    Swal.fire({
                        title: "Processing Failed",
                        text: "Something went wrong. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                        customClass: {
                            container: "swal-container",
                            popup: "swal-popup",
                            title: "swal-title",
                            content: "swal-content",
                            confirmButton: "swal-confirm-button",
                        },
                    }).then(() => {
                        startTransition("", NAV_TRANSITION_CONFIG)
                        setTimeout(() => {
                            setDbTicket({ status: "idle" })
                            setIsUploading(null)
                            navigate("../dash", { replace: true })
                            finishTransition()
                        }, NAV_TRANSITION_CONFIG.fadeInDuration)
                    })
                    return
                }
                if (data.status === "extracted") {
                    clearInterval(interval)
                }
                setDbTicket((prev) => ({
                    ...prev,
                    status: data.status,
                    text: data.extraction?.data,
                    corners: data.extraction?.apex,
                    downloadUrl: data.imageUrl,
                }))
            } catch (err) {
                console.error("Polling error:", err)
                clearInterval(interval)
                setIsUploading(false)
            }
        }, 2000)

        return () => clearInterval(interval)
    }, [isUploading, dbTicket.id, setDbTicket, token, setIsUploading, navigate, logout, startTransition, finishTransition])

    useEffect(() => {
        const currentIndex = statusOrder.indexOf(dbTicket.status)

        setVisibleSteps((prev) => {
            return steps.map((step, i) => {
                const requiredIndex = statusOrder.indexOf(step.doneAt)

                if (currentIndex >= requiredIndex) {
                    return { ...step, state: "done" }
                }

                return { ...step, state: "loading" }
            })
        })
    }, [dbTicket.status])

    return (
        <div className="status-section" id="status-section">
            <div className="status-box" ref={statusBoxRef}>
                {visibleSteps.map((step, i) => {
                    const started = stepStartTick.current[i] !== -1
                    if (!started) return null
                    const elapsed = tick - stepStartTick.current[i]
                    const cycleComplete = elapsed >= 4
                    const nextStarted = i < steps.length - 1 ? stepStartTick.current[i + 1] !== -1 : true
                    const showCheck = cycleComplete && step.state === "done" && nextStarted
                    const dotsCount = !showCheck ? elapsed % 4 : 0

                    return (
                        <div key={i} className="status-row">
                            <span>
                                {step.label}
                                {".".repeat(dotsCount)}
                            </span>
                            {showCheck && <span className="check">✔</span>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
