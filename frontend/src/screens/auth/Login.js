import React from 'react'
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import logo from '../../assets/logo.png'
import GlobalStyles from '../../GlobalStyles';

import { View, Image, Text, TextInput, TouchableOpacity } from '../../components/react-native'


import setCSRFCookie from '../../utils/setCSRFCookie'

import AuthContext from '../../context/AuthContext';


const Login = () => {
    const auth = React.useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()

    const [userData, setUserData] = React.useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = React.useState({
        common: '',
        email: '',
        password: ''
    })

    React.useEffect(() => {
        setCSRFCookie()
    }, [])

    // const handleClick = () => {
    //     console.log('logging in...')
    //     login(userData)
    //         .then(res => res.data.isAuthenticated && navigate(from, { replace: true }))
    // }

    const login = async () => {
        const body = JSON.stringify(userData)
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/authentication/login`, body, config)
                .then(res => {
                    if (res.data.error) console.log(res.data.error)
                    else {
                        auth.setIsAuthenticated(true)
                        navigate(location.state?.from || "/", { replace: true })
                    }
                })
        } catch (err) { console.log(err) }
    }

    return <View style={GlobalStyles.container}>

        <View style={styles.loginForm}>
            <Image source={logo} alt="logo" style={{ width: 150, height: 150, marginBottom: 10 }} />
            <TextInput
                style={GlobalStyles.input}
                name="email"
                placeholder='Email'
                type="email"
                onChange={e => setUserData({ ...userData, email: e.target.value })}
            />

            <TextInput
                style={GlobalStyles.input}
                placeholder="Пароль"
                name="password"
                type="password"
                onChange={e => setUserData({ ...userData, password: e.target.value })}
            />

            <TouchableOpacity style={GlobalStyles.button} onClick={login}>Войти</TouchableOpacity>
            <Text>Нет аккаунта? <Link to="/registration">Регистрация</Link></Text>
            <Link to="/">Забыли пароль?</Link>
        </View>
    </View>
}

export default Login

const styles = {
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',

        padding: 30,
        minWidth: 320,
        width: 'calc(60% - 60px)',

        backgroundColor: 'white',
        borderRadius: 15
    },

}

