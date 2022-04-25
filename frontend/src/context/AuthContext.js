import React, { useState, useCallback, useEffect, createContext } from 'react'
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

    const register = async code => {

        await axios.post(`${process.env.REACT_APP_API_URL}/authentication/register`, { ...userData, code: code })
            // await axios.post(`${process.env.REACT_APP_API_URL}/authentication/send_verification_code`, { ...userData })
            .then(res => {
                console.log(res)
                // if (res.data.error) throw res.data.error
                // else navigate('/login')
            })
    }

    const request_verification_code = async userData => {
        setUserData(userData)
        await axios.post(`${process.env.REACT_APP_API_URL}/authentication/request_verification_code`, { email: userData.email })
    }

    const request_reset_code = async email => {
        await axios.post(`${process.env.REACT_APP_API_URL}/authentication/request_verification_code`, { email: email })
    }

    const login = async userData => {

        await axios.post(`${process.env.REACT_APP_API_URL}/authentication/token`, { ...userData })
            .then(res => {
                setTokens(res.data)
                setUser(jwt_decode(res.data.access))
                localStorage.setItem('tokens', JSON.stringify(res.data))
                navigate('/')
            })
        // .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const logout = () => {
        setTokens(null)
        setUser(null)
        localStorage.removeItem('tokens')
    }

    useEffect(() => {
        console.log('AuthContext useEffect')

        const refreshToken = async () => {
            await axios.post(`${process.env.REACT_APP_API_URL}/authentication/token/refresh`, { refresh: tokens.refresh })
                .then(res => {
                    setTokens(res.data)
                    setUser(jwt_decode(res.data.access))
                    localStorage.setItem('tokens', JSON.stringify(res.data))
                })
                .catch(err => err.response.status === 401 ? logout() : console.log(err))
        }
        const fourMinutes = 1000 * 60 * 4
        const interval = setInterval(() => {
            tokens && refreshToken()
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [tokens, loading])


    // useEffect(() => {
    //     setTokens(localStorage.getItem('token') || null)
    // }, [])


    return <AuthContext.Provider value={{ loading, splashLoading, tokens, user, login, logout, request_verification_code, request_reset_code, register, header, setHeader }}>
        {children}
    </AuthContext.Provider>
}

