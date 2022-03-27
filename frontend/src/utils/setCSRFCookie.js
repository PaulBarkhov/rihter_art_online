import axios from "axios"

const setCSRFToken = async () => {
    try {
        await axios.get(`${process.env.REACT_APP_API_URL}/get_csrf`)
    } catch (err) {
        console.log(`An error ${err} occured when tried to fetch CSRF token`)
    }
}

export default setCSRFToken