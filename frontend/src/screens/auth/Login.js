import React from 'react'
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import logo from '../../assets/logo.png'
import GlobalStyles from '../../GlobalStyles';

import { View, Image, Text, TextInput, TouchableOpacity } from '../../components/react-native'

import { login } from '../../actions/auth'

import setCSRFCookie from '../../utils/setCSRFCookie'


const Login = ({ login, isAuthenticated }) => {
    const navigate = useNavigate()
    const location = useLocation()

    if (isAuthenticated)
        navigate('/')

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

    const handleClick = () => {
        console.log('logging in...')
        login(userData)
        navigate('/')
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

            <TouchableOpacity style={GlobalStyles.button} onClick={handleClick}>Войти</TouchableOpacity>
            <Text>Нет аккаунта? <Link to="/registration">Регистрация</Link></Text>
            <Link to="/">Забыли пароль?</Link>
        </View>
    </View>
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)

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

