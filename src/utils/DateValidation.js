import Swal from "sweetalert2"

const handleDateBlur = (e, formData, setFormData) => {




    const pickupDate = formData.pickupDate ? formData.pickupDate : null
    const pickupTime = formData.pickupTime ? formData.pickupTime : null
    const dropoffDate = formData.dropoffDate ? formData.dropoffDate : null
    const dropoffTime = formData.dropoffTime ? formData.dropoffTime : null

    const todayObject = new Date()
    todayObject.setHours(0, 0, 0, 0);

    const [year, month, day] = e.target.value.split('-')
    const pickupDateObject = new Date(year, month - 1, day)
    pickupDateObject.setHours(0, 0, 0, 0)

    const sixMonthsAfterToday = new Date();
    sixMonthsAfterToday.setMonth(sixMonthsAfterToday.getMonth() + 6);


    //pickup date
    if (pickupDateObject <= todayObject) {
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

    if (pickupDateObject > sixMonthsAfterToday) {
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











    function validateTime() {
        const pickupTime = new Date(`1970-01-01T${formData.pickupTime}:00`);
        const dropoffTime = new Date(`1970-01-01T${value}:00`);
        console.log('inside validateTime', pickupTime, dropoffTime);
        if (dropoffTime <= pickupTime && formData.pickupDate === formData.dropoffDate) {
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

    const name = e.target.name
    const value = e.target.value

    if (name === 'pickupDate') {
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0);

        const [year, month, day] = value.split('-')
        const pickupDate = new Date(year, month - 1, day)
        pickupDate.setHours(0, 0, 0, 0)

        const dropOffDate = formData.dropoffDate

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
        if (pickupDate === dropOffDate && formData.dropoffTime) {
            validateTime()
            return
        }
    }




    else if (name === 'dropoffDate') {
        const pickupDate = new Date(formData.pickupDate);
        const dropoffDate = new Date(value);
        console.log('pickupdate', pickupDate, 'dropoffdate', dropoffDate, pickupDate === dropoffDate);
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
        if (pickupDate.getTime() === dropoffDate.getTime() && formData.dropoffTime) {
            console.log('they are equal');
            validateTime()
            return
        }
    }

    else if (name === 'dropoffTime' || name === 'pickupTime') {
        validateTime(name)
        return
    }
}

export default handleDateBlur



//compare pickupDate vs pickupTime

