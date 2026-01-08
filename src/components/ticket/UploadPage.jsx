import './ticket.css'
import { useState, useRef } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

const UploadPage = ({ setToken }) => {

    const [attachment, setAttachment] = useState(null)
    const fileInputRef = useRef(null)

    const handleCapture = (e) => {
        e.preventDefault()
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAttachment(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!attachment) alert('there is no attachment')
        try {
            const response = await new Promise((resolve, reject) => setTimeout(resolve, 1000))

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
        <div className="quote-container ticket-container section" id="ticket-upload-id">

            <form className="ticket__form quote__form">

                <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

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
                        >
                            Submit
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="button upload-logout-button "
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default UploadPage;