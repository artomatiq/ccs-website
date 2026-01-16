/* global cv */
import fourPointTransform from "./fourPointTransform"

export default function cropTicket(img) {


    function cleanup() {
        src.delete()
        gray.delete()
        edges.delete()
        // blurred.delete()
        // edged.delete()
        hsv.delete()
        mask.delete()
        kernel.delete()
        contours.delete()
        hierarchy.delete()
    }

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


    //validate image

    const edges = new cv.Mat()
    cv.Canny(gray, edges, 50, 150)

    const edgeDensity = cv.countNonZero(edges) / (edges.rows * edges.cols)
    if (edgeDensity < 0.01) {
        src.delete()
        gray.delete()
        edges.delete()
        throw new Error("No document detected")
    }





    /*
    GRAYSCALE APPROACH

    //find document contour

    //reduce noise
    const blurred = new cv.Mat()
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0)
    //get cleaner edges
    const edged = new cv.Mat()
    cv.Canny(blurred, edged, 50, 150)
    //find all contours
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    */



    //COLOR APPROACH

    //convert to hsv
    const hsv = new cv.Mat()
    cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV)

    //extract hue channel
    const channels = new cv.MatVector()
    cv.split(hsv, channels)
    const hChannel = channels.get(0)

    //wrap hChannel in a MatVector for calcHist
    const matVec = new cv.MatVector()
    matVec.push_back(hChannel)

    //compute histogram of hue
    const histSize = [180]
    const ranges = [0, 180]
    const hist = new cv.Mat()
    cv.calcHist(matVec, [0], new cv.Mat(), hist, histSize, ranges)

    //find dominant hue
    let maxVal = 0
    let dominantHue = 0
    for (let i = 0; i < 180; i++) {
        const val = hist.data32F[i]
        if (val > maxVal) {
            maxVal = val
            dominantHue = i
        }
    }

    //create yellow mask from dominant hue
    const hueMargin = 3   // ±7 degrees around dominant
    const lower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [dominantHue - hueMargin, 50, 100, 0])
    const upper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [dominantHue + hueMargin, 255, 255, 255])

    const mask = new cv.Mat()
    cv.inRange(hsv, lower, upper, mask)

    //clean up mask
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(4, 4))
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 2) // fill gaps
    cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2)  // remove noise
    // return mask

    //find contours
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)










    //preview contours
    const contourPreview = new cv.Mat.zeros(mask.rows, mask.cols, cv.CV_8UC3)

    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i)           // get the contour
        const peri = cv.arcLength(cnt, true)
        const approx = new cv.Mat()
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true) // approximate polygon

        // draw the approximated contour
        const approxVec = new cv.MatVector()
        approxVec.push_back(approx)
        const color = new cv.Scalar(0, 255, 0) // green
        cv.drawContours(contourPreview, approxVec, 0, color, 2, cv.LINE_8)

        // cleanup
        approx.delete()
        approxVec.delete()
        cnt.delete()
    }
    // return contourPreview









    //sort contours by area, largest first
    const contourArray = []
    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i)
        contourArray.push(cnt)
        // console.log('Contour', i, 'area:', cv.contourArea(cnt))
    }
    contourArray.sort((a, b) => cv.contourArea(b) - cv.contourArea(a))


    let docContour = null
    //find largest 4-point rectangle in the sorted contours
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

    if (!docContour) {
        cleanup()
        throw new Error("Unable to locate document")
    }

    const pts = [];
    for (let i = 0; i < 4; i++) {
        pts.push({
            x: docContour.intAt(i, 0),
            y: docContour.intAt(i, 1)
        });
    }

    //perspective transform

    const warped = fourPointTransform(src, docContour)
    docContour.delete()


    cleanup()

    return warped
}