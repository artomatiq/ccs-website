import './ticket.css'
import { useState, useEffect, useRef } from "react";
import handleFileChange from '../../utils/ticket/handleFileChange';
// import axios from 'axios';
import Swal from 'sweetalert2';
import ImagePreview from './ImagePreview';
import uploadToS3 from '../../api/uploadToS3';
import { useAuth } from '../../auth/AuthContext';

const UploadPage = () => {
    const {token, setToken} = useAuth()
    const [attachment, setAttachment] = useState(null)
    const fileInputRef = useRef(null)
    const [imageSrc, setImageSrc] = useState(null)
    const [portrait, setPortrait] = useState(null)
    useEffect(() => {
        const element = document.querySelector('.ticket-container')
        const scroll = () => window.scrollTo(0, element.offsetTop)
        if (element) scroll()
    }, []);
    const handleCapture = (e) => {
        e.preventDefault()
        fileInputRef.current.value = ""
        fileInputRef.current.click()
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!attachment) {
            alert('there is no attachment')
            return
        }
        if (!portrait) {
            Swal.fire({
                title: "Ticket must be in portrait mode",
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            return
        }
        try {
            const {key, ticketId} = await uploadToS3(imageSrc, setToken)
            Swal.fire({
                title: "Upload Successful!",
                icon: 'success',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            console.log("Uploaded ticket key:", key, "ticketId:", ticketId)
            setAttachment(null)
            setImageSrc(null)
            setPortrait(null)
            fileInputRef.current.value = ""
        } catch (error) {
            console.log(error, error.stack)
            Swal.fire({
                title: error.status,
                text: error.message,
                icon: 'error',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
        }
    }
    const handleLogout = () => {
        sessionStorage.removeItem("driverToken")
        setToken(null)
    }
    return (
        <div className="quote-container section" id="ticket-upload-section">
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
                            setPortrait
                        })
                    }
                />
                <ImagePreview src={imageSrc} setImageSrc={setImageSrc} hidden={!imageSrc} setPortrait={setPortrait} />
                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="button"
                            onClick={handleCapture}
                            className="button"
                            id='attach-button'
                        >
                            {attachment ? "Replace" : "Attach Photo"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="button"
                            disabled={!attachment}
                            hidden={!attachment}
                        >
                            Submit
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="button"
                        id='logout-button'
                    >
                        Logout
                    </button>
                </div>
            </form>
        </div>
    );
}
export default UploadPage;