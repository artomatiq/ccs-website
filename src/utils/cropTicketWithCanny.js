/* global cv */
import fourPointTransform from "./fourPointTransform"

export default function cropTicketWithCanny(img) {

    //read image
    const src = cv.imread(img)

    //weed out unsupported formats
    if (src.channels() !== 1 && src.channels() !== 3 && src.channels() !== 4) {
        src.delete()
        throw new Error(`Unsupported number of channels: ${src.channels()}`)
    }
    //turn to grayscale
    const gray = new cv.Mat()
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
    //reduce noise
    const blurred = new cv.Mat()
    const blurSize = new cv.Size(5, 5)
    cv.GaussianBlur(gray, blurred, blurSize, 1)
    //get cleaner edges
    const edged = new cv.Mat()
    cv.Canny(blurred, edged, 75, 200)
    //morphological transform
    const kernelSize = new cv.Size(6, 6)
    const kernel = cv.getStructuringElement(
        cv.MORPH_RECT,
        kernelSize
    )
    cv.dilate(edged, edged, kernel)
    // cv.morphologyEx(edged, edged, cv.MORPH_CLOSE, kernel)
    kernel.delete()

    //find all contours
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    hierarchy.delete()
    //sort contours by area, largest first
    const contourArray = []
    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i)
        contourArray.push(cnt)
    }
    contourArray.sort((a, b) => cv.contourArea(b) - cv.contourArea(a))

    //reject garbage uploads
    const imgArea = src.rows * src.cols
    const docArea = cv.contourArea(contourArray[0])
    const areaRatio = docArea / imgArea
    if (areaRatio < 0.15 || areaRatio > 0.95) {
        src.delete()
        gray.delete()
        blurred.delete()
        edged.delete()
        contours.delete()
        for (const cnt of contourArray) cnt.delete()
        throw new Error('Unable to locate document. Please chooose another photo.')
    }

    // //preview contours
    // const contourPreview = new cv.Mat.zeros(edged.rows, edged.cols, cv.CV_8UC3)
    // for (let i = 0; i < contours.size(); i++) {
    //     const cnt = contours.get(i)           // get the contour
    //     const peri = cv.arcLength(cnt, true)
    //     const approx = new cv.Mat()
    //     cv.approxPolyDP(cnt, approx, 0.02 * peri, true) // approximate polygon

    //     // draw the approximated contour
    //     const approxVec = new cv.MatVector()
    //     approxVec.push_back(approx)
    //     const color = new cv.Scalar(0, 255, 0) // green
    //     cv.drawContours(contourPreview, approxVec, 0, color, 2, cv.LINE_8)

    //     // cleanup
    //     approx.delete()
    //     approxVec.delete()
    // }
    // return contourPreview


    //find largest 4-point rectangle in the sorted contours
    let docContour = null
    for (const cnt of contourArray) {
        const peri = cv.arcLength(cnt, true) //get length of contour
        const approx = new cv.Mat()
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true) //approximate contour to simpler polygon/smoothing lines
        if (approx.rows === 4) {
            docContour = approx
            break
        }
        approx.delete()
    }

    //reject docContour if the proportions of the rectangle are not within a specific range
    if (docContour) {
        // extract the 4 points
        const pts = []
        for (let i = 0; i < 4; i++) {
            pts.push({
                x: docContour.intPtr(i, 0)[0],
                y: docContour.intPtr(i, 0)[1],
            })
        }
        // helper to compute distance
        const dist = (p1, p2) =>
            Math.hypot(p1.x - p2.x, p1.y - p2.y)
        // compute side lengths (assumes approxPolyDP returns ordered points)
        const d0 = dist(pts[0], pts[1])
        const d1 = dist(pts[1], pts[2])
        const d2 = dist(pts[2], pts[3])
        const d3 = dist(pts[3], pts[0])
        //find average side length
        const width = (d0 + d2) / 2
        const height = (d1 + d3) / 2
        //find ratio
        const aspect = width > height ? width / height : height / width

        const ticketAspect = 2
        const tolerance = 0.15

        if (Math.abs(aspect - ticketAspect) > ticketAspect * tolerance) {
            docContour.delete()
            docContour = null
        }
    }

    if (!docContour) {
        src.delete()
        gray.delete()
        blurred.delete()
        edged.delete()
        contours.delete()
        for (const cnt of contourArray) cnt.delete()
        throw new Error('Unable to locate document. Please chooose another photo.')
    }

    //perspective transform
    const warped = fourPointTransform(src, docContour)

    src.delete()
    gray.delete()
    blurred.delete()
    edged.delete()
    contours.delete()
    for (const cnt of contourArray) cnt.delete()
    docContour.delete()

    return warped
}