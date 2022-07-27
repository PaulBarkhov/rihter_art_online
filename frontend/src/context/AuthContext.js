import React, { useState, useEffect, createContext, useMemo, useCallback } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()

    const [tokens, setTokens] = useState(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')) : null)
    const [user, setUser] = useState(() => localStorage.getItem('tokens') ? jwt_decode(localStorage.getItem('tokens')) : null)

    const [cart, setCart] = useState([])

    const [userData, setUserData] = useState({})

    const [header, setHeader] = useState("Rihter Art Online")

    const [loading, setLoading] = useState(true)
    const [splashLoading, setSplashLoading] = useState(false)

    const [showCartModal, setShowCartModal] = useState(false)

    const en = useMemo(() => {
        return navigator.language === 'ru' ? false : true
    }, [])

    const config = useMemo(() => tokens ? {
        headers: { 'Authorization': `JWT ${tokens.access}` }
    } : null, [tokens])

    const signup = async (userData) => {
        setUserData(userData)
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, { username: userData.email, ...userData }, { headers: { 'Accept-Language': en ? 'en' : 'ru' } })
    }

    const resendActivationEmail = async email => {
        setUserData({ ...userData, email: email })
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/resend_activation/`, { email: email }, { headers: { 'Accept-Language': en ? 'en' : 'ru' } })
    }

    const activate = async (uid, token) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, { uid: uid, token: token })
    }

    const resetPassword = async email => {
        setUserData({ ...userData, email: email })
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, { email: email }, { headers: { 'Accept-Language': en ? 'en' : 'ru' } })
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

    const logout = useCallback(() => {
        setTokens(null)
        setUser(null)
        localStorage.removeItem('tokens')
        setCart([])
        navigate("/login")
    }, [navigate])

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


    const fetchCourses = useCallback(async () => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/all_courses`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const fetchProfileData = useCallback(async () => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/profile/me`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const updateProfileData = async (profileData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/profile/update`, profileData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const updateProfileImage = async (formData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/profile/update_profile_image`, formData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchCourseData = useCallback(async (courseID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/course/${courseID}`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const fetchLessonStatus = useCallback(async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/get_status`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const fetchLessonData = useCallback(async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}`, config)
    }, [config])

    const fetchExcersizeData = useCallback(async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/excersizes/1`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const sendExcersizeMessage = async (lessonID, formData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/excersizes/1/messages`, formData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const deleteExcersizeMessage = async (lessonID, excersizeID, messageID) => {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/excersizes/${excersizeID}/messages/${messageID}`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchComments = useCallback(async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/comments`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const postComment = async (lessonID, formData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/comments`, formData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const deleteComment = async (commentID) => {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/comment/${commentID}`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }



    const getPaymentLink = async data => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/payments/`, data, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    // useEffect(() => {
    //     const uploadCart = async () => {
    //         await axios.post(`${process.env.REACT_APP_API_URL}/payments/cart`, { cartItems: cart }, config)
    //     }
    //     config && uploadCart()
    // }, [cart, config])

    // const fetchCart = useCallback(async () => {
    //     console.log('fetching cart...')
    //     return await axios.get(`${process.env.REACT_APP_API_URL}/payments/cart`, config)
    //         .catch(err => err.response.status === 401 ? logout() : console.log(err))
    // }, [config, logout])

    const addCartItems = useCallback(async (cartItems) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/payments/cart`, { cartItems: cartItems }, config)
            .then(res => setCart(res.data))
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    const deleteCartItem = useCallback(async (id) => {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/payments/cart/${id}`, config)
            .then(res => setCart(res.data))
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }, [config, logout])

    useEffect(() => {
        const fetchCart = async () => {
            console.log('fetching cart...')
            return await axios.get(`${process.env.REACT_APP_API_URL}/payments/cart`, config)
                .catch(err => err.response.status === 401 ? logout() : console.log(err))
        }
        tokens &&
            fetchCart().then(res => setCart(res.data || []))
    }, [config, tokens, logout])

    return <AuthContext.Provider
        value={{
            userData,
            loading,
            splashLoading,
            tokens,
            user,
            header,
            en,
            login,
            logout,
            resetPassword,
            setNewPassword,
            signup,
            resendActivationEmail,
            activate,
            setHeader,
            fetchCourses,
            fetchProfileData,
            updateProfileData,
            updateProfileImage,
            fetchCourseData,
            fetchLessonStatus,
            fetchLessonData,
            fetchExcersizeData,
            sendExcersizeMessage,
            deleteExcersizeMessage,
            fetchComments,
            postComment,
            deleteComment,

            getPaymentLink,
            setCart,
            cart,
            showCartModal,
            setShowCartModal,
            addCartItems,
            deleteCartItem,
        }}>
        {children}
    </AuthContext.Provider>
}

