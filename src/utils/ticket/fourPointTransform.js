/* global cv */
function orderPoints(pts) {
    const arr = []
    for (let i = 0; i < 4; i++) {
        arr.push({
            x: pts.data32S[i * 2],
            y: pts.data32S[i * 2 + 1]
        })
    }
    arr.sort((a, b) => (a.x + a.y) - (b.x + b.y))
    const tl = arr[0]
    const br = arr[3]

    arr.sort((a, b) => (a.y - a.x) - (b.y - b.x))
    const tr = arr[0]
    const bl = arr[3]

    return [tl, tr, br, bl]
}

export default function fourPointTransform(src, pts) {
    const [tl, tr, br, bl] = orderPoints(pts)

    //compute width of new image
    const widthA = Math.hypot(br.x - bl.x, br.y - bl.y)
    const widthB = Math.hypot(tr.x - tl.x, tr.y - tl.y)
    let maxWidth = Math.round(Math.max(widthA, widthB))
    //compute height of new image
    const heightA = Math.hypot(tr.x - br.x, tr.y - br.y)
    const heightB = Math.hypot(tl.x - bl.x, tl.y - bl.y)
    let maxHeight = Math.round(Math.max(heightA, heightB))
    if (maxWidth >= maxHeight) {
        // landscape
        maxWidth = Math.round(maxWidth)
        maxHeight = Math.round(maxWidth * 0.47)
    } else {
        // portrait
        maxHeight = Math.round(maxHeight)
        maxWidth = Math.round(maxHeight * 0.47)
    }
    //destination points
    const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0, //top-left
        maxWidth - 1, 0, //top-right
        maxWidth - 1, maxHeight - 1, //bottom right
        0, maxHeight - 1 //bottom left
    ])
    //source points
    const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y
    ])
    //encode the transformation needed for each pixel
    const M = cv.getPerspectiveTransform(srcPts, dstPts)
    //warp image
    const dst = new cv.Mat()
    cv.warpPerspective(src, dst, M, new cv.Size(maxWidth, maxHeight))
    //cleanup
    srcPts.delete()
    dstPts.delete()
    M.delete()

    return dst
}