import './ticket.css'
import { useEffect } from "react";
import PasscodePage from './PasscodePage';
import UploadPage from './UploadPage';
import { useAuth } from '../../auth/AuthContext';

const Ticket = () => {

    useEffect(() => {
        const button = document.querySelector('.ticket-button.nav-button');
        const element = document.querySelector('.ticket-container')
        const scroll = () => window.scrollTo(0, element.offsetTop)
        if (element) {
            scroll()
            if (button) button.addEventListener('click', scroll);
            return () => {
                button.removeEventListener('click', scroll);
            };
        }
    }, []);
    const isMobile = true ///Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const {token} = useAuth()
    return (
        isMobile ? (
            <div className="quote-container ticket-container section" id="about-id">
                <div className="title section segment">
                    <span className="hide" >Submit Hauling Ticket</span>
                </div>
                {token
                    ? <UploadPage/>
                    : <PasscodePage/>
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