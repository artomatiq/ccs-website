import axios from 'axios'

const loginDriver = async (passcode) => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL

    try {
        console.log('sending request');
        const res = await axios.post(
            `${BASE_URL}/login`,
            { passcode },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return {token: res.data.token}
    } catch (err) {
        return {error: err.response?.data?.error || 'Server error'}
    }
}

export default loginDriver