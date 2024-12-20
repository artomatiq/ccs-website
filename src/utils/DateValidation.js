const handleDateBlur = (e, formData, setFormData) => {
    const name = e.target.name
    const value = e.target.value
    if (name === 'pickupDate') {
        const todayDate = new Date()
        const pickupDate = new Date(value)
        if (pickupDate <= todayDate) {
            alert('Please select a pick-up date that is later than today.')
            setFormData(prevState => ({ ...prevState, [name]: '' }));
            return
        }
        const sixMonthsAfterToday = new Date();
        sixMonthsAfterToday.setMonth(sixMonthsAfterToday.getMonth() + 6);
        if (pickupDate > sixMonthsAfterToday) {
            alert('Please select a pick-up date that is no more than 6 months away.')
            setFormData(prevState => ({ ...prevState, [name]: '' }));
            return
        }
    } else if (name === 'dropoffDate') {
        const pickupDate = new Date(formData.pickupDate);
        const dropoffDate = new Date(value);
        if (dropoffDate < pickupDate) {
            alert('Please select a drop-off date that is later than the pick-up date.');
            setFormData(prevState => ({ ...prevState, [name]: '' }));
            return
        }
        const oneMonthAfterPickup = new Date(pickupDate);
        oneMonthAfterPickup.setMonth(pickupDate.getMonth() + 1);
        if (dropoffDate > oneMonthAfterPickup) {
            alert('Please select a drop-off date that is no more than one month after the pick-up date.');
            setFormData(prevState => ({ ...prevState, [name]: '' }));
            return
        }
    }
}

export default handleDateBlur