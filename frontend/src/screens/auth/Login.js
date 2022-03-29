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
        server: '',
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
        setErrors({
            server: '',
            email: !userData.email ? 'Введите Email' : '',
            password: !userData.password ? 'Введите Пароль?' : ''
        })
        if (userData.email && userData.password) {
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
                        if (res.data.error) {
                            setUserData({ email: '', password: '' })
                            setErrors({ ...errors, server: res.data.error })
                        }
                        else {
                            auth.setIsAuthenticated(true)
                            navigate(location.state?.from || "/", { replace: true })
                        }
                    })
            } catch (err) { console.log(err) }
        }
    }

    return <View style={GlobalStyles.container}>

        <View style={styles.loginForm}>
            <Image source={logo} alt="logo" style={{ width: 150, height: 150, marginBottom: 10 }} />
            <Text style={styles.error}>{errors.server}</Text>
            <TextInput
                style={errors.email ? GlobalStyles.redBorderInput : GlobalStyles.input}
                name="email"
                placeholder={errors.email ? 'Введите Email' : 'Email'}
                placeholderTextColor={errors.email ? 'red' : 'grey'}
                value={userData.email}
                type="email"
                onChange={e => {
                    setErrors({ ...errors, email: '' })
                    setUserData({ ...userData, email: e.target.value })
                }}
            />
            <TextInput
                style={errors.password ? GlobalStyles.redBorderInput : GlobalStyles.input}
                name="password"
                placeholder={errors.password ? 'Введите пароль' : 'Пароль'}
                placeholderTextColor={errors.email ? 'red' : 'grey'}
                value={userData.password}
                type="password"
                onChange={e => {
                    setErrors({ ...errors, password: '' })
                    setUserData({ ...userData, password: e.target.value })
                }}
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
    error: {
        height: 30
    }

}

