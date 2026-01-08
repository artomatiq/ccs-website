import './ticket.css'
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const UploadPage = ({ setToken }) => {


    const handleUpload = () => {

    }

    const handleLogout = () => {
        sessionStorage.removeItem("driverToken")
        setToken(null)
    }

    const [attachment, setAttachment] = useState(false)

    return (
        <div className="quote-container ticket-container section" id="about-id">

            <form className="ticket__form quote__form">
                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="submit"
                            onClick={handleUpload}
                            className="button"
                            disabled={!attachment}
                        >
                            Upload Photo
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