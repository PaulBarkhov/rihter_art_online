import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()

    const [tokens, setTokens] = useState(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('tokens') ? jwt_decode(localStorage.getItem('tokens')) : null)

    const [userData, setUserData] = useState({})

    const [header, setHeader] = useState("Rihter Art Online")

    const [loading, setLoading] = useState(true)
    const [splashLoading, setSplashLoading] = useState(false)

    console.log(tokens)

    const signup = async (userData) => {
        setUserData(userData)
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, { username: userData.email, ...userData })
    }

    const resendActivationEmail = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/resend_activation/`, { email: userData.email })
    }

    const resetPassword = async email => {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, { email: email })
    }

    const setNewPassword = async (uid, token, new_password, re_new_password) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, { uid, token, new_password, re_new_password })
    }

    const login = async userData => {

        await axios.post(`${process.env.REACT_APP_API_URL}/authentication/token`, { ...userData })
            .then(res => {
                setTokens(res.data)
                setUser(jwt_decode(res.data.access))
                localStorage.setItem('tokens', JSON.stringify(res.data))
                navigate('/profile')
            })
        // .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const logout = () => {
        setTokens(null)
        setUser(null)
        localStorage.removeItem('tokens')
        navigate("/login")
    }

    useEffect(() => {
        const refreshToken = async () => {
            await axios.post(`${process.env.REACT_APP_API_URL}/authentication/token/refresh`, { refresh: tokens.refresh })
                .then(res => {
                    setTokens(res.data)
                    setUser(jwt_decode(res.data.access))
                    localStorage.setItem('tokens', JSON.stringify(res.data))
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        setTokens(null)
                        setUser(null)
                        localStorage.removeItem('tokens')
                        navigate("/login")
                    }
                })
        }
        // const fourMinutes = 1000 * 60 * 4
        // const interval = setInterval(() => {
        //     tokens && refreshToken()
        // }, fourMinutes)
        // return () => clearInterval(interval)
    }, [tokens, navigate])

    // useEffect(() => {
    //     setTokens(localStorage.getItem('token') || null)
    // }, [])


    return <AuthContext.Provider value={{ userData, loading, splashLoading, tokens, user, login, logout, resetPassword, setNewPassword, signup, resendActivationEmail, header, setHeader }}>
        {children}
    </AuthContext.Provider>
}

