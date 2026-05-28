import "../ticket/ticket.css"
import { useState, useEffect, useRef } from "react"
import handleFileChange from "../../../utils/ticket/handleFileChange"
import Swal from "sweetalert2"
import ImagePreview from "../image-preview/ImagePreview"
import TicketCornerEditor from "../ticket-corner-editor/TicketCornerEditor"
import uploadToS3 from "../../../api/uploadToS3"
import { useAuth } from "../../../auth/AuthContext"
import { useTransitionNavigate } from "../../../contexts/TransitionContext"

const UploadPage = ({ setDbTicket, setIsUploading }) => {
    const { setToken } = useAuth()
    const navigate = useTransitionNavigate()
    const [attachment, setAttachment] = useState(null)
    const fileInputRef = useRef(null)
    const [rawImage, setRawImage] = useState(null)
    const [imageSrc, setImageSrc] = useState(null)
    const [portrait, setPortrait] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            if (attachment) {
                const ticket = document.querySelector(".ticket-container")
                if (!ticket) return
                const ticketTop =
                    ticket.getBoundingClientRect().top + window.scrollY
                window.scrollTo({ top: ticketTop - 70 })
                return
            }
            const footer = document.querySelector(".footer-container")
            if (!footer) return
            const footerTop =
                footer.getBoundingClientRect().top + window.scrollY
            const scrollTo = Math.max(0, footerTop - window.innerHeight)
            window.scrollTo({ top: scrollTo })
        })
        return () => cancelAnimationFrame(id)
    }, [attachment])
    const handleCapture = (e) => {
        e.preventDefault()
        fileInputRef.current.value = ""
        fileInputRef.current.click()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!portrait) {
            Swal.fire({
                title: "Ticket must be in portrait mode",
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
        setIsSubmitting(true)
        try {
            const { ticketId } = await uploadToS3(imageSrc, setToken)
            setDbTicket({ status: "awaiting-upload", id: ticketId })
            setIsUploading(true)
            navigate("../status")
        } catch (error) {
            console.log(error, error.stack)
            Swal.fire({
                title: "Upload failed",
                text: error.message,
                icon: "error",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
            setIsSubmitting(false)
        }
    }
    return (
        <div className="quote-container section" id="ticket-upload-section">
            <button id="back-button" onClick={() => navigate(-1)}>
                <i className="bx bx-arrow-back" />
                Back
            </button>
            <form className="ticket__form quote__form">
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={(e) =>
                        handleFileChange({
                            e,
                            setRawImage,
                            setAttachment,
                            setImageSrc,
                            setPortrait,
                        })
                    }
                />
                {rawImage && !imageSrc && (
                    <TicketCornerEditor
                        rawImage={rawImage}
                        onConfirm={(dataUrl, isPortrait) => {
                            setImageSrc(dataUrl)
                            setPortrait(isPortrait)
                            setRawImage(null)
                        }}
                    />
                )}
                <ImagePreview
                    src={imageSrc}
                    setImageSrc={setImageSrc}
                    hidden={!imageSrc}
                    setPortrait={setPortrait}
                />
                <button
                    type="button"
                    onClick={handleCapture}
                    className="button attach-photo-button"
                    id={attachment ? "replace-button" : "attach-button"}
                >
                    {!attachment && (
                        <>
                            <span className="bracket tl" aria-hidden="true"></span>
                            <span className="bracket tr" aria-hidden="true"></span>
                            <span className="bracket bl" aria-hidden="true"></span>
                            <span className="bracket br" aria-hidden="true"></span>
                        </>
                    )}
                    <i className={attachment ? "fa-solid fa-arrows-rotate" : "fa-solid fa-camera"} aria-hidden="true"></i>
                    <span>{attachment ? "Replace" : "Attach Photo"}</span>
                </button>
                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`button${isSubmitting ? " is-loading" : ""}`}
                            disabled={!imageSrc || isSubmitting}
                            hidden={!imageSrc}
                        >
                            {isSubmitting ? (
                                <>
                                    Submit
                                    <span className="dots-anim"></span>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default UploadPage
