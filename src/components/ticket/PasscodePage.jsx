import './ticket.css'
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const PasscodePage = () => {

    useEffect(() => {
        // const button = document.querySelector('.ticket.nav-button');
        // const element = document.querySelector('.ticket-container')
        // if (element) {
        //     window.scrollTo(0, element.offsetTop)
        //     button.addEventListener('click', () => window.scrollTo(0, element.offsetTop));
        //     return () => {
        //         element.removeEventListener('click', () => window.scrollTo(0, element.offsetTop));
        //     };
        // }
    }, []);

    const [passcode, setPasscode] = useState()

    const handleChange = (e) => {
        const { value } = e.target;
        // const updatedFormData = { ...formData, [name]: value };
        // setFormData(updatedFormData);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="quote-container ticket-container section" id="about-id">

            <form className="ticket__form quote__form">
                <div className="upload-button segment">
                    <div className="form-div upload">
                        <button
                            type="submit"
                            value="Send"
                            onClick={handleLogin}
                            className="button"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default PasscodePage;