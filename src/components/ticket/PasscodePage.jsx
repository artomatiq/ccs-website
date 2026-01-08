import './ticket.css'
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import loginDriver from '../../api/mock';

const PasscodePage = (props) => {

    const [passcode, setPasscode] = useState("")

    const handleChange = (e) => {
        const { value } = e.target;
        setPasscode(value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginDriver(passcode)
            const token = response.token
            if (!token) throw new Error("Login failed by the server.")
            sessionStorage.setItem("driverToken", token)
            props.handleLoginSuccess(token)
        } catch (error) {
            Swal.fire({
                title: error.status || "",
                text: error.message,
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

    return (
        <div className="quote-container ticket-container section" id="ticket-login-id">

            <form className="ticket__form quote__form">
                <div className="passcode input segment" id='passcode-input'>
                    <div className="form-div passcode">
                        <input
                            type="password"
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
                            disabled={passcode.length < 4}
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