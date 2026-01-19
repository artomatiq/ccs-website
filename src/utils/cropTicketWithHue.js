/* global cv */
import fourPointTransform from "./fourPointTransform"

export default function cropTicketWithHue(img) {

    //read image
    const src = cv.imread(img)

    //weed out unsupported formats
    if (src.channels() !== 1 && src.channels() !== 3 && src.channels() !== 4) {
        src.delete()
        throw new Error(`Unsupported number of channels: ${src.channels()}`)
    }

    //COLOR APPROACH

    //convert to hsv
    const hsv = new cv.Mat()
    cv.cvtColor(src, hsv, cv.COLOR_RGBA2HSV)
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
    const noMask = new cv.Mat()
    cv.calcHist(matVec, [0], noMask, hist, histSize, ranges)
    noMask.delete()
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
    const hueMargin = 6 
    const lower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [dominantHue - hueMargin, 40, 50, 0])
    const upper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [dominantHue + hueMargin, 255, 255, 255])
    const mask = new cv.Mat()
    cv.inRange(hsv, lower, upper, mask)

    //clean up mask
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5))
    cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 1) // fill gaps
    cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 1)  // remove noise
    kernel.delete()

    //find contours
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    hierarchy.delete()


    // //preview contours
    // const contourPreview = new cv.Mat.zeros(mask.rows, mask.cols, cv.CV_8UC3)

    // for (let i = 0; i < contours.size(); i++) {
    //     const cnt = contours.get(i)           // get the contour
    //     const peri = cv.arcLength(cnt, true)
    //     const approx = new cv.Mat()
    //     const area = cv.contourArea(cnt)
    //     const imgArea = src.rows * src.cols
    //     if (area < imgArea * 0.1) {
    //         cnt.delete()
    //         continue
    //     }
    //     cv.approxPolyDP(cnt, approx, 0.02 * peri, true) // approximate polygon
    //     // draw the approximated contour
    //     const approxVec = new cv.MatVector()
    //     approxVec.push_back(approx)
    //     const color = new cv.Scalar(0, 255, 0) // green
    //     cv.drawContours(contourPreview, approxVec, 0, color, 2, cv.LINE_8)
    // }
    // return contourPreview


    //sort contours by area, largest first
    const contourArray = []
    for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i)
        contourArray.push(cnt)
    }
    contourArray.sort((a, b) => cv.contourArea(b) - cv.contourArea(a))

    //find largest 4-point rectangle in the sorted contours
    let docContour = null
    for (const cnt of contourArray) {
        const peri = cv.arcLength(cnt, true) //get length of contour
        const approx = new cv.Mat()
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true) //approximate contour to simpler polygon

        if (approx.rows === 4) {
            docContour = approx
            break
        }
        approx.delete()
    }

    if (!docContour) {
        src.delete()
        hsv.delete()
        channels.delete()
        hChannel.delete()
        matVec.delete()
        hist.delete()
        lower.delete()
        upper.delete()
        mask.delete()
        contours.delete()
        for (const cnt of contourArray) cnt.delete()
        throw new Error("Unable to locate document")
    }

    //perspective transform
    const warped = fourPointTransform(src, docContour)

    src.delete()
    hsv.delete()
    channels.delete()
    hChannel.delete()
    matVec.delete()
    hist.delete()
    lower.delete()
    upper.delete()
    mask.delete()
    contours.delete()
    for (const cnt of contourArray) cnt.delete()
    docContour.delete()

    return warped
}