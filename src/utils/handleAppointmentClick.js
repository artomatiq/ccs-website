import Swal from "sweetalert2";

// const isTouchDevice = 'ontouchstart' in window && (window.innerWidth <= 1024);

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

    const pickupDateInputId = 'origin-date'
    const pickupTimeInputId = 'origin-time'
    const dropoffDateInputId = 'dest-date'
    const pickupDateInput = document.querySelector(`#${pickupDateInputId}`)
    const pickupTimeInput = document.querySelector(`#${pickupTimeInputId}`)
    const dropoffDateInput = document.querySelector(`#${dropoffDateInputId}`)
    const inputArray = [dropoffDateInput, pickupTimeInput, pickupDateInput]

    const target = e.target.tagName === 'INPUT' ? e.target : e.target.querySelector('input');
    // if (!isTouchDevice || !target || !target.disabled) return

    for (let input of inputArray) {
        if (target.disabled && !input.disabled) {
            fireSwal(input.dataset.name);
            break;
        }
    }

}

export default handleAppointmentClick