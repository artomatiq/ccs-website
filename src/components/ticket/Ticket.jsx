import './ticket.css'
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import PasscodePage from './PasscodePage';
import UploadPage from './UploadPage';

const Ticket = () => {

    useEffect(() => {
        const button = document.querySelector('.ticket-button.nav-button');
        const element = document.querySelector('.ticket-container')
        if (element) {
            window.scrollTo(0, element.offsetTop)
            button.addEventListener('click', () => window.scrollTo(0, element.offsetTop));
            return () => {
                element.removeEventListener('click', () => window.scrollTo(0, element.offsetTop));
            };
        }
    }, []);

    const isMobile = true ///Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const [authorized, setAuthorized] = useState(false)
    // const directVisit = 

    return (
        isMobile ? (
            <div className="quote-container ticket-container section" id="about-id">
                <div className="title section segment">
                    <span className="hide" >Submit Hauling Ticket</span>
                </div>
                {authorized
                    ? <UploadPage />
                    : <PasscodePage />
                }

            </div>
        ) : (
            <div>
                <h3>Please use a smartphone.</h3>
            </div>
        )
    );

}
export default Ticket;