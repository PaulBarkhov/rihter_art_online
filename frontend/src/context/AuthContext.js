import React, { useState, useEffect, createContext, useMemo } from 'react'
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

    const en = useMemo(() => {
        return navigator.language === 'ru' ? false : true
    }, [])

    const config = tokens ? {
        headers: { 'Authorization': `JWT ${tokens.access}` }
    } : null

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


    const fetchCourses = async () => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/all_courses`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchProfileData = async () => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/profile/me`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const updateProfileData = async (profileData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/profile/update`, profileData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const updateProfileImage = async (formData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/profile/update_profile_image`, formData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchCourseData = async (courseID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/course/${courseID}`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchLessonStatus = async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/get_status`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchLessonData = async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}`, config)
    }

    const fetchExcersizeData = async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/excersizes/1`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const sendExcersizeMessage = async (lessonID, formData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/excersizes/1/messages`, formData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const deleteExcersizeMessage = async (lessonID, excersizeID, messageID) => {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/excersizes/${excersizeID}/messages/${messageID}`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const fetchComments = async (lessonID) => {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/comments`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const postComment = async (lessonID, formData) => {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/lesson/${lessonID}/comments`, formData, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }

    const deleteComment = async (commentID) => {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/comment/${commentID}`, config)
            .catch(err => err.response.status === 401 ? logout() : console.log(err))
    }


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
            deleteComment
        }}>
        {children}
    </AuthContext.Provider>
}

