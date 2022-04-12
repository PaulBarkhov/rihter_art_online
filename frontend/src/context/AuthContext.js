import React, { useCallback, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()

    const [tokens, setTokens] = React.useState(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null)
    const [user, setUser] = React.useState(() => localStorage.getItem('tokens') ? jwt_decode(localStorage.getItem('tokens')) : null)

    const [loading, setLoading] = React.useState(true)
    const [splashLoading, setSplashLoading] = React.useState(false)

    const register = async userData => {
        const body = JSON.stringify(userData)
        // const config = {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': Cookies.get('csrftoken')
        //     }
        // }
        await axios.post(`${process.env.REACT_APP_API_URL}/authentication/register`, { ...userData })
            .then(res => {
                if (res.data.error) throw res.data.error
                else navigate('/login')
            })
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


    // React.useEffect(() => {
    //     setTokens(localStorage.getItem('token') || null)
    // }, [])


    return <AuthContext.Provider value={{ loading, splashLoading, tokens, user, login, logout, register }}>
        {children}
    </AuthContext.Provider>
}

