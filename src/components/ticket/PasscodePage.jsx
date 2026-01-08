import './ticket.css'
import { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

const PasscodePage = () => {

    useEffect(() => {
    }, []);

    const [passcode, setPasscode] = useState()

    const handleChange = (e) => {
        const { value } = e.target;
        setPasscode(value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        axios.send()
    }

    return (
        <div className="quote-container ticket-container section" id="about-id">

            <form className="ticket__form quote__form">
                <div className="passcode input segment">
                    <div className="form-div passcode">
                        <input
                            type="text"
                            name="passcode"
                            className="passcode-input"
                            id="passcode-input"
                            placeholder='Enter driver passcode'
                            value={passcode}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="passcode segment">
                    <div className="form-div passcode">
                        <button
                            type="submit"
                            value="send"
                            onClick={handleLogin}
                            className="button"
                            disabled={passcode.length<4}
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