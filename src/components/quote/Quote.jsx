import './quote.css'
import { useState } from "react";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const Quote = () => {

    const initialState = {
        origin: '',
        pickupDate: '',
        pickupTime: '',
        destination: '',
        dropoffDate: '',
        dropoffTime: '',
        vehicle: '',
        rush: false,
        name: '',
        company: '',
        email: '',
        notes: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [valid, setValid] = useState(false)

    const validate = (data) => {
        if (
            data.origin &&
            data.pickupDate &&
            data.pickupTime &&
            data.destination &&
            data.dropoffDate &&
            data.dropoffTime &&
            data.vehicle &&
            data.name &&
            data.email
        ) return true
        else {
            return false
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        const isValid = validate(updatedFormData);
        setValid(isValid);
        setFormData(updatedFormData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || formData.name.length < 2) {
            Swal.fire({
                title: 'Invalid Name',
                text: 'Please provide a name with at least 2 characters.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please provide a valid email address.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            return;
        }

        emailjs
            .send('service_crxagxx', 'template_qp97umb', formData, {
                publicKey: '1LrsqCWwK1-KwUSbt',
            })
            .then(
                () => {
                    console.log('Quote successfully sent!');
                    Swal.fire({
                        title: 'Success!',
                        text: 'Thank you for your interest. We will be in touch with you soon.',
                        icon: 'success',
                        customClass: {
                            container: 'swal-container',
                            popup: 'swal-popup',
                            title: 'swal-title',
                            content: 'swal-content',
                            confirmButton: 'swal-confirm-button'
                        }
                    });
                },
                (error) => {
                    console.log('Failed to send request...', error.text);
                    Swal.fire({
                        title: 'Error',
                        text: 'There was an error submitting your request.',
                        icon: 'failure',
                        customClass: {
                            container: 'swal-container',
                            popup: 'swal-popup',
                            title: 'swal-title',
                            content: 'swal-content',
                            confirmButton: 'swal-confirm-button'
                        }
                    });
                },
            );

        setFormData(initialState)
        setValid(false)
    }


    return (
        <div className="quote-container section" id='quote-id'>
            <div className="title section segment">
                <span className="hide">
                    Request Quote
                </span>
            </div>

            <form className="quote__form">

                <div className="origin-container segment">
                    <div className="subtitle">
                        Origin
                    </div>
                    <div className="origin-content">
                        <div className="form-div location">
                            <label htmlFor="origin-location" className="location-label">Location</label>
                            <input
                                type="text"
                                name="origin"
                                className="location-input"
                                id="origin-location"
                                value={formData.origin}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-div appointment">
                            <div className="form-div date">
                                <label htmlFor="origin-date" className="date-label">Date</label>
                                <input
                                    type="text"
                                    name="pickupDate"
                                    className="date-input"
                                    id="origin-date"
                                    value={formData.pickupDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-div time">
                                <label htmlFor="origin-time" className="time-label">Time</label>
                                <input
                                    type="text"
                                    name="pickupTime"
                                    className="time-input"
                                    id="origin-time"
                                    value={formData.pickupTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>



                <div className="dest-container segment">
                    <div className="subtitle">
                        Destination
                    </div>
                    <div className="dest-content">
                        <div className="form-div location">
                            <label htmlFor="dest-location" className="location-label">Location</label>
                            <input
                                type="text"
                                name="destination"
                                className="location-input"
                                id="dest-location"
                                value={formData.destination}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-div appointment">
                            <div className="form-div date">
                                <label htmlFor="dest-date" className="date-label">Date</label>
                                <input
                                    type="text"
                                    name="dropoffDate"
                                    className="date-input"
                                    id="dest-date"
                                    value={formData.dropoffDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-div time">
                                <label htmlFor="dest-time" className="time-label">Time</label>
                                <input
                                    type="text"
                                    name="dropoffTime"
                                    className="time-input"
                                    id="dest-time"
                                    value={formData.dropoffTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="load-container segment">
                    {/* <div className="title">
                        Load
                    </div> */}
                    <div className="load-content">
                        <div className="form-div appointment">
                            <div className="form-div load">
                                <label htmlFor="load-vehicle" className="vehicle-label">Vehicle</label>
                                <input
                                    type="text"
                                    name="vehicle"
                                    className="vehicle-input"
                                    id="load-vehicle"
                                    value={formData.vehicle}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-div rush">
                                <label htmlFor="load-rush" className="rush-label">Rush Order</label>
                                <input
                                    type="text"
                                    name="rush"
                                    className="rush-input"
                                    id="load-rush"
                                    value={formData.rush}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="personal-top segment">
                    <div className="subtitle">
                        Contact Info
                    </div>
                    <div className="form-div name">
                        <label htmlFor="dest-name" className="name-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="name-input"
                            id="dest-name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-div company">
                        <label htmlFor="dest-company" className="company-label">Company</label>
                        <input
                            type="text"
                            name="company"
                            className="company-input"
                            id="dest-company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-div email">
                        <label htmlFor="dest-email" className="email-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="contact__form-input"
                            id="dest-email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>



                <div className="personal-bottom segment">
                    <div className="form-div message">
                        <label htmlFor="dest-message" className="message-label">Notes</label>
                        <textarea
                            type="text"
                            name="notes"
                            cols="30"
                            rows="10"
                            className="message-input"
                            id="dest-message"
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>
                </div>



                <div className="form-section-bottom segment">
                    <div className="form-div submit">
                        <button
                            type="submit"
                            value="Send"
                            onClick={handleSubmit}
                            className="button"
                            disabled={!valid}
                        >
                            Submit
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default Quote;