import './quote.css'
import { useState, useRef, useEffect } from "react";
import Swal from 'sweetalert2';
import { Autocomplete } from '@react-google-maps/api';
import handleDateBlur from '../../utils/DateValidation';
import sendEmail from '../../utils/Emailjs';
import handleAppointmentClick from '../../utils/handleAppointmentClick';

const Quote = () => {

    useEffect(() => {
        const button = document.querySelector('.quote-button.nav-button');
        const element = document.querySelector('.quote-container')
        if (element) {
            window.scrollTo(0, element.offsetTop)
            button.addEventListener('click', () => window.scrollTo(0, element.offsetTop));
            return () => {
                element.removeEventListener('click', () => window.scrollTo(0, element.offsetTop));
            };
        }
    }, []);

    const initialState = {
        origin: '',
        pickupDate: '',
        pickupTime: '',
        destination: '',
        dropoffDate: '',
        dropoffTime: '',
        vehicle: 'Sprinter Van',
        rush: false,
        name: '',
        company: '',
        email: '',
        notes: '',
    }

    const [formData, setFormData] = useState(initialState)
    const [valid, setValid] = useState(false)
    const autocompleteOrigin = useRef(null);
    const autocompleteDestination = useRef(null);
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [selectedDest, setSelectedDest] = useState(false);

    const validate = (data) => {
        if (
            data.origin &&
            data.pickupDate &&
            data.pickupTime &&
            data.destination &&
            data.dropoffDate &&
            data.dropoffTime &&
            data.vehicle &&
            data.name &&
            data.email
        ) return true
        else {
            return false
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        const isValid = validate(updatedFormData);
        setValid(isValid);
        setFormData(updatedFormData);
    }

    const handlePlaceChanged = (autocompleteRef, fieldName) => {

        const place = autocompleteRef.current.getPlace()

        if (fieldName === 'origin') setSelectedOrigin(place)
        else setSelectedDest(place)

        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: place?.formatted_address || '',
        }))

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || formData.name.length < 2) {
            Swal.fire({
                title: 'Invalid Name',
                text: 'Please provide a name with at least 2 characters.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please provide a valid email address.',
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            return;
        }

        sendEmail(e, formData)

        setFormData(initialState)
        setValid(false)
    }


    return (
        <div className="quote-container section" id='quote-id'>
            <div className="title section segment">
                <span className="hide">
                    Request Quote
                </span>
            </div>

            <form className="quote__form">


                <div className="origin-dest">
                        <div className="origin-container segment">
                            <div className="subtitle">
                                Origin
                            </div>
                            <div className="origin-content">
                                <div className="form-div location">
                                    <label htmlFor="origin-location" className="location-label">Location</label>
                                    <Autocomplete
                                        onLoad={(autocompleteInstance) => (autocompleteOrigin.current = autocompleteInstance)}
                                        onPlaceChanged={() => handlePlaceChanged(autocompleteOrigin, 'origin')}
                                    >
                                        <input
                                            type="text"
                                            name="origin"
                                            className="location-input"
                                            id="origin-location"
                                            placeholder='Enter an address'
                                            value={formData.origin}
                                            onChange={handleChange}
                                            onBlur={(e) => {
                                                if (!selectedOrigin || e.target.value !== selectedOrigin.formatted_address) {
                                                    setSelectedOrigin('')
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        origin: '',
                                                    }));
                                                }
                                            }}
                                        />
                                    </Autocomplete>
                                </div>
                                <div className="form-div appointment">
                                    <div className="form-div date">
                                        <label htmlFor="origin-date" className="date-label">Date</label>
                                        <input
                                            type="date"
                                            name="pickupDate"
                                            data-name="pick-up date"
                                            className="date-input"
                                            id="origin-date"
                                            value={formData.pickupDate}
                                            onChange={handleChange}
                                            onBlur={(e) => handleDateBlur(e, formData, setFormData)}
                                        />
                                    </div>
                                    <div className="form-div time" id='pickupTimeTap' onClick={handleAppointmentClick}>
                                        <label htmlFor="origin-time" className="time-label">Time</label>
                                        <input
                                            type="time"
                                            name="pickupTime"
                                            data-name="pick-up time"
                                            className="time-input"
                                            id="origin-time"
                                            value={formData.pickupTime}
                                            onChange={handleChange}
                                            disabled={!formData.pickupDate}
                                            style={{ pointerEvents: formData.pickupDate ? 'auto' : 'none' }} //let event propagate on disbaled input
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dest-container segment">
                            <div className="subtitle">
                                Destination
                            </div>
                            <div className="dest-content">
                                <div className="form-div location">
                                    <label htmlFor="dest-location" className="location-label">Location</label>
                                    <Autocomplete
                                        onLoad={(autocompleteInstance) => (autocompleteDestination.current = autocompleteInstance)}
                                        onPlaceChanged={() => handlePlaceChanged(autocompleteDestination, 'destination')}
                                    >
                                        <input
                                            type="text"
                                            name="destination"
                                            className="location-input"
                                            id="dest-location"
                                            value={formData.destination}
                                            placeholder='Enter an address'
                                            onChange={handleChange}
                                            onBlur={(e) => {
                                                if (!selectedDest || e.target.value !== selectedDest.formatted_address) {
                                                    setSelectedDest('')
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        destination: '',
                                                    }));
                                                }
                                            }}
                                        />
                                    </Autocomplete>
                                </div>
                                <div className="form-div appointment">
                                    <div className="form-div date" id='dropoffDateTap' onClick={handleAppointmentClick}>
                                        <label htmlFor="dest-date" className="date-label">Date</label>
                                        <input
                                            type="date"
                                            name="dropoffDate"
                                            data-name="drop-off date"
                                            className="date-input"
                                            id="dest-date"
                                            value={formData.dropoffDate}
                                            onChange={handleChange}
                                            onBlur={(e) => handleDateBlur(e, formData, setFormData)}
                                            disabled={!formData.pickupDate || !formData.pickupTime}
                                            style={{ pointerEvents: formData.pickupTime ? 'auto' : 'none' }} //let event propagate on disbaled input
                                        />
                                    </div>
                                    <div className="form-div time" id='dropoffTimeTap' onClick={handleAppointmentClick}>
                                        <label htmlFor="dest-time" className="time-label">Time</label>
                                        <input
                                            type="time"
                                            name="dropoffTime"
                                            className="time-input"
                                            id="dest-time"
                                            value={formData.dropoffTime}
                                            onChange={handleChange}
                                            onBlur={(e) => handleDateBlur(e, formData, setFormData)}
                                            disabled={!formData.pickupDate || !formData.pickupTime || !formData.dropoffDate}
                                            style={{ pointerEvents: formData.dropoffDate ? 'auto' : 'none' }} //let event propagate on disbaled input
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>


                <div className="middle-section">

                    <div className="load-content segment">
                        <div className="form-div vehicle">
                            <label htmlFor="load-vehicle" className="vehicle-label">Vehicle</label>
                            <select
                                name="vehicle"
                                className="vehicle-input"
                                id="load-vehicle"
                                value={formData.vehicle}
                                onChange={handleChange}
                            >
                                <option value="Sprinter Van">Sprinter Van</option>
                                <option value="Car">Car</option>
                                <option value="Box Truck">Box Truck</option>
                            </select>
                        </div>
                        <div className="form-div rush">
                            <label htmlFor="load-rush" className="rush-label">
                                Rush
                            </label>
                            <input
                                type="checkbox"
                                name="rush"
                                className="rush-input"
                                id="load-rush"
                                checked={formData.rush}
                                onChange={(e) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        rush: e.target.checked,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="notes segment">
                        <div className="form-div message">
                            <label htmlFor="dest-message" className="message-label">Notes</label>
                            <textarea
                                type="text"
                                name="notes"
                                cols="30"
                                rows="10"
                                className="message-input"
                                id="dest-message"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                </div>


                <div className="personal segment">
                    <div className="subtitle">
                        Contact Info
                    </div>
                    <div className="form-div name">
                        <label htmlFor="dest-name" className="name-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="name-input"
                            id="dest-name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-div company">
                        <label htmlFor="dest-company" className="company-label">Company</label>
                        <input
                            type="text"
                            name="company"
                            className="company-input"
                            id="dest-company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-div email">
                        <label htmlFor="dest-email" className="email-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="contact__form-input"
                            id="dest-email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="submit-button segment">
                    <div className="form-div submit">
                        <button
                            type="submit"
                            value="Send"
                            onClick={handleSubmit}
                            className="button"
                            disabled={!valid}
                        >
                            Submit
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default Quote;