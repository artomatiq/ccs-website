import Swal from "sweetalert2"

const fireSwal = (text) => {
    Swal.fire({
        title: '',
        text: text,
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

const handleDateBlur = (e, formData, setFormData) => {

    const targetName = e.target.name

    const pickupDate = formData.pickupDate ? formData.pickupDate : null
    const pickupTime = formData.pickupTime ? formData.pickupTime : null
    const dropoffDate = formData.dropoffDate ? formData.dropoffDate : null
    const dropoffTime = formData.dropoffTime ? formData.dropoffTime : null

    const todayDateObject = new Date()
    todayDateObject.setHours(0, 0, 0, 0);

    let pickupDateObject
    if (pickupDate) {
        const [year, month, day] = pickupDate.split('-')
        pickupDateObject = new Date(year, month - 1, day)
        pickupDateObject.setHours(0, 0, 0, 0)
    }
    let dropoffDateObject
    if (dropoffDate) {
        const [year, month, day] = dropoffDate.split('-')
        dropoffDateObject = new Date(year, month - 1, day)
        dropoffDateObject.setHours(0, 0, 0, 0)
    }

    const sixMonthsAfterTodayObject = new Date();
    sixMonthsAfterTodayObject.setMonth(sixMonthsAfterTodayObject.getMonth() + 6);

    const oneMonthAfterPickupObject = new Date(pickupDate);
    oneMonthAfterPickupObject.setMonth(oneMonthAfterPickupObject.getMonth() + 1);


    //pickup date
    if (targetName === 'pickupDate') {
        if (pickupDateObject <= todayDateObject) {
            fireSwal('Pick-up date must be later than today.')
            setFormData(prevState => ({ ...prevState, [targetName]: '' }))
            return;
        }
        if (pickupDateObject > sixMonthsAfterTodayObject) {
            fireSwal('Pick-up date cannot be more than 6 months away.')
            setFormData(prevState => ({ ...prevState, [targetName]: '' }))
            return;
        }
        if (dropoffDate) {
            if (pickupDate > dropoffDate) {
                fireSwal('Pick-up date must precede drop-off date.')
                setFormData(prevState => ({ ...prevState, [targetName]: '' }))
                return;
            }
            if (dropoffDateObject > oneMonthAfterPickupObject) {
                fireSwal('Pick-up date can precede drop-off date at most by a month.')
                setFormData(prevState => ({ ...prevState, dropoffDate: '' }))
                return;
            }
        }
    }

    //dropoff date
    if (targetName === 'dropoffDate') {
        if (dropoffDate < pickupDate) {
            fireSwal('Pick-up date must precede drop-off date.')
            setFormData(prevState => ({ ...prevState, [targetName]: '' }))
            return;
        }
        if (dropoffDateObject > oneMonthAfterPickupObject) {
            fireSwal('Pick-up date can precede drop-off date at most by a month.')
            setFormData(prevState => ({ ...prevState, [targetName]: '' }))
            return;
        }
    }

    //same day
    if (dropoffDate && pickupDate === dropoffDate) {
        if (pickupTime >= dropoffTime) {
            fireSwal('Pick-up time must precede drop-off time on same-day deliveries.')
            setFormData(prevState => ({ ...prevState, dropoffTime: '' }))
            return;
        }
    }
}

export default handleDateBlur