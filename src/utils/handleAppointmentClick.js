import Swal from "sweetalert2";

// const isTouchDevice = 'ontouchstart' in window && (window.innerWidth <= 1024);
const isTouchDevice = true

const pickupTimeInputId = 'origin-time'
const dropoffDateInputId = 'dest-date'

const pickupTimeInput = document.querySelector(`#${pickupTimeInputId}`)
const dropoffDateInput = document.querySelector(`#${dropoffDateInputId}`)

const fireSwal = (inputName) => {
    Swal.fire({
        title: '',
        text: `Please first select a ${inputName}.`,
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

const handleAppointmentClick = (e) => {
    console.log('handling app click')

    const target = e.target.tagName === 'INPUT' ? e.target : e.target.querySelector('input');
    if (!isTouchDevice || !target.disabled) return

    if (!pickupTimeInput.disabled) {
        fireSwal('pick-up time')
    }

    else if (!dropoffDateInput.disabled) {
        fireSwal('drop-off date')
    }

    else {
        fireSwal('pick-up date')
    }
}

export default handleAppointmentClick