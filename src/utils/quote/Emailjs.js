import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const sendEmail = (e, formData) => {

    const service_id = process.env.REACT_APP_EMAILJS_SERVICE_ID
    const template_id = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
    const public_key = process.env.REACT_APP_EMAILJS_PUBLIC_KEY

    emailjs
            .send(service_id, template_id, formData, {
                publicKey: public_key,
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
}

export default sendEmail