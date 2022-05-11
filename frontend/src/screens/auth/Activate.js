import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const Activate = () => {
    const params = useParams()
    const [isActivated, setIsActivated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const activate = async () => {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, { uid: params.uid, token: params.token })
                .then(setIsActivated(true))
                .catch(err => console.log(err.response))
                .finally(setLoading(false))
        }
        activate()
    }, [params.uid, params.token])

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center align-items-center text-center'>
            {loading && <h1>Пожалуйста подождите...</h1>}
            {isActivated ? <div><h1>Аккаунт активирован!</h1><Link to="/login" className="btn btn-primary" role="button">Войти</Link></div> : <h1>Что-то пошло не так...</h1>}
        </div>
    )
}

export default Activate