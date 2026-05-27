import Swal from "sweetalert2"
import { heicTo } from "heic-to"

export default async function handleFileChange({
    e,
    setRawImage,
    setAttachment,
    setImageSrc,
    setPortrait,
}) {
    function resetState() {
        setRawImage(null)
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
    const MAX_SIZE = 8 * 1024 * 1024
    if (file.size > MAX_SIZE) {
        Swal.fire({
            title: "File too large",
            text: "Please upload an image under 8MB",
            icon: "warning",
            customClass: {
                container: "swal-container",
                popup: "swal-popup",
                title: "swal-title",
                content: "swal-content",
                confirmButton: "swal-confirm-button",
            },
        })
        e.target.value = ""
        resetState()
        return
    }
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
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
            e.target.value = ""
            resetState()
            return
        }
    }
    setImageSrc(null)
    setPortrait(null)
    setAttachment(file)
    setRawImage(file)
}
