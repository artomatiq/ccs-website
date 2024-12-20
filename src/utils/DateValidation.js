import Swal from "sweetalert2"

const handleDateBlur = (e, formData, setFormData) => {
    const name = e.target.name
    const value = e.target.value
    if (name === 'pickupDate') {
        const todayDate = new Date()
        const pickupDate = new Date(value)
        if (pickupDate <= todayDate) {
            Swal.fire({
                title: 'Invalid Date',
                text: 'Please select a pick-up date that is later than today.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            setFormData(prevState => ({ ...prevState, [name]: '' }))
            return;
        }
        const sixMonthsAfterToday = new Date();
        sixMonthsAfterToday.setMonth(sixMonthsAfterToday.getMonth() + 6);
        if (pickupDate > sixMonthsAfterToday) {
            Swal.fire({
                title: 'Invalid Date',
                text: 'Please select a pick-up date that is no more than 6 months away.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            setFormData(prevState => ({ ...prevState, [name]: '' }))
            return;
        }
    } else if (name === 'dropoffDate') {
        const pickupDate = new Date(formData.pickupDate);
        const dropoffDate = new Date(value);
        if (dropoffDate < pickupDate) {
            Swal.fire({
                title: 'Invalid Date',
                text: 'Please select a drop-off date that is later than the pick-up date.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            setFormData(prevState => ({ ...prevState, [name]: '' }))
            return;
        }
        const oneMonthAfterPickup = new Date(pickupDate);
        oneMonthAfterPickup.setMonth(pickupDate.getMonth() + 1);
        if (dropoffDate > oneMonthAfterPickup) {
            Swal.fire({
                title: 'Invalid Date',
                text: 'Please select a drop-off date that is no more than one month after the pick-up date.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            setFormData(prevState => ({ ...prevState, [name]: '' }))
            return;
        }
    }

    else if (name === 'dropoffTime') {
        console.log('form data', formData);
        const pickupTime = new Date(`1970-01-01T${formData.pickupTime}:00`);
        const dropoffTime = new Date(`1970-01-01T${value}:00`);
        console.log(dropoffTime, '<=', pickupTime);
        if (dropoffTime <= pickupTime) {
            Swal.fire({
                title: 'Invalid Time',
                text: 'Please select a drop-off time that is later than the pick-up time.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            setFormData(prevState => ({ ...prevState, [name]: '' }));
            return;
        }
    }
}

export default handleDateBlur