import "../ticket/ticket.css"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import handleFileChange from "../../../utils/ticket/handleFileChange"
import Swal from "sweetalert2"
import ImagePreview from "../image-preview/ImagePreview"
import uploadToS3 from "../../../api/uploadToS3"
import { useAuth } from "../../../auth/AuthContext"

const UploadPage = ({ setDbTicket, setIsUploading }) => {
    const { setToken } = useAuth()
    const navigate = useNavigate()
    const [attachment, setAttachment] = useState(null)
    const fileInputRef = useRef(null)
    const [imageSrc, setImageSrc] = useState(null)
    const [portrait, setPortrait] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            const scroll = () => {
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
            }
            requestAnimationFrame(scroll)
        }, 800)
        return () => clearTimeout(timer)
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
        try {
            setIsSubmitting(true)
            const { key, ticketId } = await uploadToS3(imageSrc, setToken)
            setIsSubmitting(false)
            await Swal.fire({
                title: "Upload Successful!",
                icon: "success",
                confirmButtonText: "Next",
                customClass: {
                    container: "swal-container",
                    popup: "swal-popup",
                    title: "swal-title",
                    content: "swal-content",
                    confirmButton: "swal-confirm-button",
                },
            })
            setAttachment(null)
            setImageSrc(null)
            setPortrait(null)
            fileInputRef.current.value = ""
            setDbTicket({
                status: "uploading",
                id: ticketId,
            })
            setIsUploading(true)
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
        } finally {
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
                            setAttachment,
                            setImageSrc,
                            setPortrait,
                        })
                    }
                />
                <ImagePreview
                    src={imageSrc}
                    setImageSrc={setImageSrc}
                    hidden={!imageSrc}
                    setPortrait={setPortrait}
                />
                <button
                    type="button"
                    onClick={handleCapture}
                    className="button"
                    id={attachment? "replace-button" : "attach-button"}
                >
                    {attachment ? "Replace" : "Attach Photo"}
                </button>
                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="button"
                            disabled={!attachment || isSubmitting}
                            hidden={!attachment}
                        >
                            {isSubmitting ? (
                                <>
                                    Uploading
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
