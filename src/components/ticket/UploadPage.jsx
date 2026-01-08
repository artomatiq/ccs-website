import './ticket.css'
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const UploadPage = () => {

    const handleUpload = () => {

    }

    const [attachment, setAttachment] = useState(false)

    return (
        <div className="quote-container ticket-container section" id="about-id">

            <form className="ticket__form quote__form">
                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="submit"
                            value="Send"
                            onClick={handleUpload}
                            className="button"
                            disabled={!attachment}
                        >
                            Upload Photo
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default UploadPage;