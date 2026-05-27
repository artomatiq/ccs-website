/* global cv */
import "./ticketCornerEditor.css"
import { useEffect, useRef, useState } from "react"
import Draggable from "react-draggable"
import Swal from "sweetalert2"
import detectTicketCorners from "../../../utils/ticket/detectTicketCorners"
import fourPointTransform from "../../../utils/ticket/fourPointTransform"

const HANDLE_SIZE = 150
const CORNER_NAMES = ["tl", "tr", "br", "bl"]
const NEIGHBORS = { tl: ["tr", "bl"], tr: ["br", "tl"], br: ["bl", "tr"], bl: ["tl", "br"] }
const LOUPE_SIZE = 175
const LOUPE_ZOOM = 2.5
const LOUPE_GAP = 20
const TL_LOUPE_GAP = 0
const ROLLBACK_MS = 400
const HISTORY_MS = 700

const calcDisplayWidth = () =>
    Math.min(Math.round(window.innerWidth * 0.9), 350)

const TicketCornerEditor = ({ rawImage, onConfirm }) => {
    const imgRef = useRef(null)
    const fullCanvasRef = useRef(null)
    const loupeRef = useRef(null)
    const historyRef = useRef([])
    const handleRefs = {
        tl: useRef(null),
        tr: useRef(null),
        br: useRef(null),
        bl: useRef(null),
    }

    const [imageUrl, setImageUrl] = useState(null)
    useEffect(() => {
        if (!rawImage) return
        const url = URL.createObjectURL(rawImage)
        setImageUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [rawImage])

    const [displaySize, setDisplaySize] = useState(null)
    const [originalSize, setOriginalSize] = useState(null)
    const [corners, setCorners] = useState(null)
    const [dragging, setDragging] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const onImageLoad = () => {
        const img = imgRef.current
        const ow = img.naturalWidth
        const oh = img.naturalHeight
        const dw = calcDisplayWidth()
        const dh = Math.round(dw * (oh / ow))
        setOriginalSize({ w: ow, h: oh })
        setDisplaySize({ w: dw, h: dh })

        const fullCanvas = document.createElement("canvas")
        fullCanvas.width = ow
        fullCanvas.height = oh
        fullCanvas.getContext("2d").drawImage(img, 0, 0, ow, oh)
        fullCanvasRef.current = fullCanvas

        const detected = detectTicketCorners(img)
        const scale = dw / ow
        if (detected) {
            setCorners({
                tl: { x: detected.tl.x * scale, y: detected.tl.y * scale },
                tr: { x: detected.tr.x * scale, y: detected.tr.y * scale },
                br: { x: detected.br.x * scale, y: detected.br.y * scale },
                bl: { x: detected.bl.x * scale, y: detected.bl.y * scale },
            })
        } else {
            const inset = 0.1
            setCorners({
                tl: { x: dw * inset, y: dh * inset },
                tr: { x: dw * (1 - inset), y: dh * inset },
                br: { x: dw * (1 - inset), y: dh * (1 - inset) },
                bl: { x: dw * inset, y: dh * (1 - inset) },
            })
        }
    }

    const updateCorner = (name) => (_, data) => {
        const pos = {
            x: data.x + HANDLE_SIZE / 2,
            y: data.y + HANDLE_SIZE / 2,
        }
        const now = performance.now()
        historyRef.current = [
            ...historyRef.current.filter((p) => now - p.t <= HISTORY_MS),
            { ...pos, t: now, name },
        ]
        setCorners((c) => ({ ...c, [name]: pos }))
    }

    const onDragStop = (name) => () => {
        const now = performance.now()
        const stable = historyRef.current
            .filter((p) => p.name === name && now - p.t >= ROLLBACK_MS)
            .pop()
        if (stable) {
            setCorners((c) => ({
                ...c,
                [name]: { x: stable.x, y: stable.y },
            }))
        }
        historyRef.current = []
        setDragging(null)
    }

    useEffect(() => {
        if (!dragging || !corners || !displaySize || !originalSize) return
        const canvas = loupeRef.current
        const fullCanvas = fullCanvasRef.current
        if (!canvas || !fullCanvas) return
        const dpr = window.devicePixelRatio || 1
        canvas.width = LOUPE_SIZE * dpr
        canvas.height = LOUPE_SIZE * dpr
        const ctx = canvas.getContext("2d")

        const c = corners[dragging]
        const scaleToOrig = originalSize.w / displaySize.w
        const halfSrcDisplay = LOUPE_SIZE / 2 / LOUPE_ZOOM
        const halfSrcOrig = halfSrcDisplay * scaleToOrig
        ctx.drawImage(
            fullCanvas,
            c.x * scaleToOrig - halfSrcOrig,
            c.y * scaleToOrig - halfSrcOrig,
            halfSrcOrig * 2,
            halfSrcOrig * 2,
            0, 0, canvas.width, canvas.height
        )
        ctx.strokeStyle = "#3cabe2"
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = canvas.width / 2
        for (const n of NEIGHBORS[dragging]) {
            const dx = corners[n].x - c.x
            const dy = corners[n].y - c.y
            const angle = Math.atan2(dy, dx)
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        }
        ctx.stroke()
    }, [dragging, corners, displaySize, originalSize])

    const handleConfirm = async () => {
        if (!corners || !originalSize) return

        const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
        const width = (dist(corners.tl, corners.tr) + dist(corners.bl, corners.br)) / 2
        const height = (dist(corners.tl, corners.bl) + dist(corners.tr, corners.br)) / 2
        const aspect = width > height ? width / height : height / width
        const TICKET_ASPECT = 2
        const TOLERANCE = 0.25
        if (Math.abs(aspect - TICKET_ASPECT) > TICKET_ASPECT * TOLERANCE) {
            Swal.fire({
                title: "Doesn't look like a ticket",
                text: "Adjust the 4 corners so the shape is roughly 2:1.",
                icon: "warning",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
            return
        }

        try {
            setIsProcessing(true)
            const scale = originalSize.w / displaySize.w
            const orig = {
                tl: { x: corners.tl.x * scale, y: corners.tl.y * scale },
                tr: { x: corners.tr.x * scale, y: corners.tr.y * scale },
                br: { x: corners.br.x * scale, y: corners.br.y * scale },
                bl: { x: corners.bl.x * scale, y: corners.bl.y * scale },
            }
            const src = cv.imread(fullCanvasRef.current)
            const ptsMat = cv.matFromArray(4, 1, cv.CV_32SC2, [
                orig.tl.x, orig.tl.y,
                orig.tr.x, orig.tr.y,
                orig.br.x, orig.br.y,
                orig.bl.x, orig.bl.y,
            ])
            const warped = fourPointTransform(src, ptsMat)
            const canvas = document.createElement("canvas")
            canvas.width = warped.cols
            canvas.height = warped.rows
            cv.imshow(canvas, warped)
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
            const isPortrait = warped.rows >= warped.cols
            src.delete()
            ptsMat.delete()
            warped.delete()
            onConfirm(dataUrl, isPortrait)
        } catch (err) {
            console.log("Cropper error:", err)
            Swal.fire({
                title: "Processing failed",
                text: "Unable to crop ticket. Please try another photo.",
                icon: "warning",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const polygonPoints = corners
        ? CORNER_NAMES.map((n) => `${corners[n].x},${corners[n].y}`).join(" ")
        : ""

    const bounds = displaySize
        ? {
            left: -HANDLE_SIZE / 2,
            top: -HANDLE_SIZE / 2,
            right: displaySize.w - HANDLE_SIZE / 2,
            bottom: displaySize.h - HANDLE_SIZE / 2,
        }
        : null

    return (
        <div id="corner-editor">
            <div
                className={`corner-editor-stage${dragging ? " corner-editor-stage--dragging" : ""}`}
                style={
                    displaySize
                        ? { width: displaySize.w, height: displaySize.h }
                        : undefined
                }
            >
                <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Ticket"
                    className="corner-editor-img"
                    onLoad={onImageLoad}
                    crossOrigin="anonymous"
                />
                {dragging && <div className="corner-editor-darken" />}
                {corners && displaySize && (
                    <>
                        <svg
                            className="corner-editor-svg"
                            width={displaySize.w}
                            height={displaySize.h}
                        >
                            <polygon
                                points={polygonPoints}
                                fill="rgba(60, 171, 226, 0.15)"
                                stroke="#3cabe2"
                                strokeWidth="2"
                            />
                        </svg>
                        {CORNER_NAMES.map((name) => (
                            <Draggable
                                key={name}
                                nodeRef={handleRefs[name]}
                                bounds={bounds}
                                scale={1.6}
                                position={{
                                    x: corners[name].x - HANDLE_SIZE / 2,
                                    y: corners[name].y - HANDLE_SIZE / 2,
                                }}
                                onStart={() => setDragging(name)}
                                onDrag={updateCorner(name)}
                                onStop={onDragStop(name)}
                            >
                                <div
                                    ref={handleRefs[name]}
                                    className="corner-editor-handle"
                                />
                            </Draggable>
                        ))}
                        {dragging && (() => {
                            const c = corners[dragging]
                            let left, top
                            if (dragging === "tl") {
                                left = c.x - TL_LOUPE_GAP - LOUPE_SIZE
                                top = c.y - TL_LOUPE_GAP - LOUPE_SIZE
                            } else {
                                const isLeftSide = dragging === "bl"
                                const isTopSide = dragging === "tr"
                                left = isLeftSide
                                    ? c.x + LOUPE_GAP
                                    : c.x - LOUPE_GAP - LOUPE_SIZE
                                top = isTopSide
                                    ? c.y + LOUPE_GAP
                                    : c.y - LOUPE_GAP - LOUPE_SIZE
                            }
                            return (
                                <canvas
                                    ref={loupeRef}
                                    className="corner-editor-loupe"
                                    style={{
                                        left: `${left}px`,
                                        top: `${top}px`,
                                        width: `${LOUPE_SIZE}px`,
                                        height: `${LOUPE_SIZE}px`,
                                    }}
                                />
                            )
                        })()}
                    </>
                )}
            </div>
            <button
                type="button"
                onClick={handleConfirm}
                className="button"
                disabled={isProcessing || !corners}
            >
                {isProcessing ? (
                    <>
                        Cropping
                        <span className="dots-anim"></span>
                    </>
                ) : (
                    "Confirm"
                )}
            </button>
        </div>
    )
}

export default TicketCornerEditor
