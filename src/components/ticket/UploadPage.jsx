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

    //TODO  
    //handle large files, do not allow large files to cost lambda rutnime
    //do not allow multiple files to be selected

    useEffect(() => {
        const element = document.querySelector('.ticket-container')
        const scroll = () => window.scrollTo(0, element.offsetTop)
        if (element) scroll()
    }, []);

    const handleCapture = (e) => {
        e.preventDefault()
        fileInputRef.current.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            setAttachment(file)
        } else return

        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = async () => {
            try {
                const dstMat = await cropTicket(img)
                //draw to canvas
                const canvas = document.createElement("canvas")
                canvas.width = dstMat.cols
                canvas.height = dstMat.rows
                cv.imshow(canvas, dstMat)
                dstMat.delete()
                setImageSrc(canvas.toDataURL())
            } catch (err) {
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
        if (!attachment) alert('there is no attachment')
        //TODO
        //reject upload if image is sideways
        try {
            // const response = await new Promise((resolve, reject) => setTimeout(resolve, 1000))
            
            const res = await fetch(imageSrc)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            window.open(url, "_blank")

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
        } catch (error) {
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