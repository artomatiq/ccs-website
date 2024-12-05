import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import './contact.css'

const Contact = () => {
    const initialState = {
        name: '',
        company: '',
        email: '',
        message: ''
    }
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        emailjs
            .send('TODO', 'TODO', formData, {
                publicKey: 'TODO',
            })
            .then(
                () => {
                    console.log('Message successfully sent!');
                    Swal.fire({
                        title: 'Success!',
                        text: 'Thanks for your message. We will be in touch with you soon.',
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
                    console.log('Failed to send email...', error.text);
                    Swal.fire({
                        title: 'Error',
                        text: 'There was an error sending your message. Please try again.',
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
    }

    return (
        <div className="contact-container section">
            <div className="title">
                Contact Us (test 3)
            </div>

            <form className="contact__form">

                <div className="form-div name">
                    <label htmlFor="contact-name" className="name-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="name-input"
                        id="contact-name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-div company">
                    <label htmlFor="contact-name" className="company-label">Company</label>
                    <input
                        type="text"
                        name="company"
                        className="company-input"
                        id="contact-company"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-div email">
                    <label htmlFor="contact-email" className="email-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="contact__form-input"
                        id="contact-email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>


                <div className="form-div message">
                    <label htmlFor="contact-message" className="message-label">Message</label>
                    <textarea
                        type="text"
                        name="message"
                        cols="30"
                        rows="10"
                        className="message-input"
                        id="contact-message"
                        value={formData.message}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-div submit">
                    <button
                        type="submit"
                        value="Send"
                        onClick={handleSubmit}
                        className="button"
                    >
                        Send Message
                    </button>
                </div>

            </form>
        </div>
    );
}
export default Contact;