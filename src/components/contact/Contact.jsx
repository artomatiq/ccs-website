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
    const [valid, setValid] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        const isValid = updatedFormData.name && updatedFormData.email && updatedFormData.message;
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
            });
            return;
        }

        if (!formData.message || formData.message.length < 20) {
            Swal.fire({
                title: 'Message Too Short',
                text: 'Please provide a message with at least 20 characters.',
                icon: 'warning',
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please provide a valid email address.',
                icon: 'warning',
            });
            return;
        }

        emailjs
            .send('service_crxagxx', 'template_qp97umb', formData, {
                publicKey: '1LrsqCWwK1-KwUSbt',
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
        <div className="contact-container section" id="contact-id">
            <div className="title">
                <span className="hide">
                    Contact Us
                </span>
            </div>

            <form className="contact__form">

                <div className="form-section-top">
                    <div className="form-section-left">
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
                            <label htmlFor="contact-company" className="company-label">Company</label>
                            <input
                                type="text"
                                name="company"
                                className="company-input"
                                id="contact-company"
                                value={formData.company}
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
                    </div>

                    <div className="form-section-right">
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
                    </div>
                </div>

                <div className="form-section-bottom">
                    <div className="form-div submit">
                        <button
                            type="submit"
                            value="Send"
                            onClick={handleSubmit}
                            className="button"
                            disabled={!valid}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Contact;