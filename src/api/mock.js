const loginDriver = async (passcode) => {
    if (passcode === '1234') {
        return {token: 'mock-jwt-token'}
    } else {
        throw new Error("Invalid passcode.")
    }
}

export default loginDriver