import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const sendEmail = (e, formData) => {
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
}

export default sendEmail