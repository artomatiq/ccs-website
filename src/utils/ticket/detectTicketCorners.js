/* global cv */

function orderPoints(pts) {
    const bySum = [...pts].sort((a, b) => (a.x + a.y) - (b.x + b.y))
    const tl = bySum[0]
    const br = bySum[3]
    const byDiff = [...pts].sort((a, b) => (a.y - a.x) - (b.y - b.x))
    const tr = byDiff[0]
    const bl = byDiff[3]
    return { tl, tr, br, bl }
}

export default function detectTicketCorners(img) {
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const src = cv.imread(canvas)
    if (src.channels() !== 1 && src.channels() !== 3 && src.channels() !== 4) {
        src.delete()
        return null
    }

    const gray = new cv.Mat()
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
    const blurred = new cv.Mat()
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 1)
    const edged = new cv.Mat()
    cv.Canny(blurred, edged, 75, 200)
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(6, 6))
    cv.dilate(edged, edged, kernel)
    kernel.delete()

    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    hierarchy.delete()

    const contourArray = []
    for (let i = 0; i < contours.size(); i++) {
        contourArray.push(contours.get(i))
    }
    contourArray.sort((a, b) => cv.contourArea(b) - cv.contourArea(a))

    const cleanup = () => {
        src.delete()
        gray.delete()
        blurred.delete()
        edged.delete()
        contours.delete()
        for (const cnt of contourArray) cnt.delete()
    }

    if (contourArray.length === 0) {
        cleanup()
        return null
    }

    const imgArea = src.rows * src.cols
    const docArea = cv.contourArea(contourArray[0])
    const areaRatio = docArea / imgArea
    if (areaRatio < 0.15 || areaRatio > 0.95) {
        cleanup()
        return null
    }

    let detected = null
    for (const cnt of contourArray) {
        const peri = cv.arcLength(cnt, true)
        const approx = new cv.Mat()
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true)
        if (approx.rows === 4) {
            const pts = []
            for (let i = 0; i < 4; i++) {
                pts.push({
                    x: approx.intPtr(i, 0)[0],
                    y: approx.intPtr(i, 0)[1],
                })
            }
            approx.delete()
            const ordered = orderPoints(pts)
            const width = (Math.hypot(ordered.tr.x - ordered.tl.x, ordered.tr.y - ordered.tl.y)
                + Math.hypot(ordered.br.x - ordered.bl.x, ordered.br.y - ordered.bl.y)) / 2
            const height = (Math.hypot(ordered.bl.x - ordered.tl.x, ordered.bl.y - ordered.tl.y)
                + Math.hypot(ordered.br.x - ordered.tr.x, ordered.br.y - ordered.tr.y)) / 2
            const aspect = width > height ? width / height : height / width
            const ticketAspect = 2
            const tolerance = 0.25
            if (Math.abs(aspect - ticketAspect) <= ticketAspect * tolerance) {
                detected = ordered
                break
            }
        } else {
            approx.delete()
        }
    }

    cleanup()
    return detected
}
