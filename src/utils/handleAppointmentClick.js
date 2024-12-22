import Swal from "sweetalert2";

const handleAppointmentClick = (e) => {
    console.log('handling app click')
    const pickupTime = document.querySelector('#origin-time')
    const dropoffDate = document.querySelector('#dest-date')
    if (e.target.disabled) {
        if (e.target.name === 'dropoffDate') {
            if (!pickupTime.disabled) {
                Swal.fire({
                    title: '',
                    text: 'Please first select a pick-up time.',
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
        else if (e.target.name === 'dropoffTime') {
            if (!pickupTime.disabled) {
                Swal.fire({
                    title: '',
                    text: 'Please first select a pick-up time.',
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
            else if (!dropoffDate.disabled) {
                Swal.fire({
                    title: '',
                    text: 'Please first select a drop-off date.',
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
        Swal.fire({
            title: '',
            text: 'Please first select a pick-up time.',
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

export default handleAppointmentClick