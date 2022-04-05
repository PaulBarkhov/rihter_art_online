import React from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import GlobalStyles from '../GlobalStyles'
import { TouchableOpacity } from '../components/react-native'

function Account() {
    const authContext = React.useContext(AuthContext)
    // const navigate = useNavigate()

    const logout = async () => {
        const body = JSON.stringify({ 'withCredentials': true })
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/authentication/logout`, body, config)
                .then(res => {
                    if (res.data.error) console.log(res.data.error)
                    else {
                        authContext.setIsAuthenticated(false)
                        // navigate('/login')
                    }
                })
        } catch (err) { console.log(err) }
    }

    return <div>
        <h1>Account</h1>
        <TouchableOpacity style={GlobalStyles.button} onPress={logout}>Выйти</TouchableOpacity>
    </div>
}


export default Account

