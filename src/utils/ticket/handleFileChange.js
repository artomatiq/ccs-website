/* global cv */
import cropTicket from "../../utils/ticket/cropTicketWithCanny"
import Swal from "sweetalert2"
import { heicTo } from "heic-to"

export default async function handleFileChange({
    e,
    setAttachment,
    setImageSrc,
    setPortrait,
}) {
    function resetState() {
        setAttachment(null)
        setImageSrc(null)
        setPortrait(null)
    }
    let file = e.target.files[0]
    if (!file) return
    console.log("File info:", {
        name: file.name,
        type: file.type,
        size: file.size,
    })
    // SIZE VALIDATION
    const MAX_SIZE = 8 * 1024 * 1024
    if (file.size > MAX_SIZE) {
        Swal.fire({
            title: "File too large",
            text: "Please upload an image under 8MB",
            icon: "warning",
        })
        e.target.value = ""
        resetState()
        return
    }
    // ✅ HANDLE HEIC → JPEG
    if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic")
    ) {
        try {
            const convertedBlob = await heicTo({
                blob: file,
                type: "image/jpeg",
                quality: 0.9,
            })
            file = new File(
                [convertedBlob],
                file.name.replace(/\.heic$/i, ".jpg"),
                { type: "image/jpeg" }
            )
            console.log("HEIC converted to JPEG")
        } catch (err) {
            console.log("HEIC conversion failed:", err)
            Swal.fire({
                title: "Unsupported image",
                text: "Could not process HEIC image. Try taking a new photo or use JPG.",
                icon: "warning",
            })
            e.target.value = ""
            resetState()
            return
        }
    }
    try {
        // ✅ LOAD IMAGE (now always JPEG/PNG)
        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = async () => {
            try {
                // 🔍 CROP WITH OPENCV
                const dstMat = await cropTicket(img)
                const canvas = document.createElement("canvas")
                const { cols: width, rows: height } = dstMat
                canvas.width = width
                canvas.height = height
                cv.imshow(canvas, dstMat)
                dstMat.delete()
                const isPortrait = height >= width
                // ✅ OUTPUT AS JPEG
                setImageSrc(canvas.toDataURL("image/jpeg", 0.9))
                setPortrait(isPortrait)
                setAttachment(file)
            } catch (err) {
                console.log("OpenCV error:", err)
                Swal.fire({
                    title: "Processing failed",
                    text: "Unable to detect ticket. Try a clearer photo.",
                    icon: "warning",
                })
                e.target.value = ""
                resetState()
            }
        }
        img.onerror = () => {
            Swal.fire({
                title: "Invalid image",
                text: "Could not load this image file.",
                icon: "warning",
            })
            e.target.value = ""
            resetState()
        }
    } catch (err) {
        console.log("Unexpected error:", err)
        Swal.fire({
            title: "Error",
            text: "Something went wrong processing the image.",
            icon: "warning",
        })
        e.target.value = ""
        resetState()
    }
}