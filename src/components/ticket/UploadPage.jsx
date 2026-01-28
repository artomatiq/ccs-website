/* global cv */
import './ticket.css'
import { useState, useEffect, useRef } from "react";
// import axios from 'axios';
import Swal from 'sweetalert2';
// import cropTicket from '../../utils/cropTicketWithHue'
import cropTicket from '../../utils/cropTicketWithCanny';
// import uploadToS3 from '../../utils/uploadToS3';
import ImagePreview from './ImagePreview';

const UploadPage = ({ setToken }) => {

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const MAX_SIZE = 5 * 1024 * 1024
            if (file.size > MAX_SIZE) {
                Swal.fire({
                    title: "File too large",
                    text: "Please upload an image under 5MB",
                    icon: "warning",
                    customClass: {
                        container: 'swal-container',
                        popup: 'swal-popup',
                        title: 'swal-title',
                        content: 'swal-content',
                        confirmButton: 'swal-confirm-button'
                    }
                })
                e.target.value = ""
                setAttachment(null)
                setImageSrc(null)
                setPortrait(null)
                return
            }
            setAttachment(file)
            setImageSrc(null)
            setPortrait(null)
        } else return

        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = async () => {
            try {
                const dstMat = await cropTicket(img)
                //draw to canvas
                const canvas = document.createElement("canvas")
                const { cols: width, rows: height } = dstMat;
                canvas.width = width;
                canvas.height = height;
                const isPortrait = height >= width
                cv.imshow(canvas, dstMat)
                dstMat.delete()
                setImageSrc(canvas.toDataURL())
                setPortrait(isPortrait)
            } catch (err) {
                console.log(err)

                setAttachment(null)
                setImageSrc(null)
                setPortrait(null)
                e.target.value = ""

                Swal.fire({
                    title: err.status,
                    text: err.message,
                    icon: 'warning',
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
            // const response = await new Promise((resolve, reject) => setTimeout(resolve, 1000))

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
            setAttachment(null)
            setImageSrc(null)
            setPortrait(null)
            fileInputRef.current.value = ""
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: error.status,
                text: error.message,
                icon: 'success',
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
                    onChange={handleFileChange}
                />

                <ImagePreview src={imageSrc} setImageSrc={setImageSrc} hidden={!imageSrc} />

                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="submit"
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