import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useParams, Link } from 'react-router-dom'

const Activate = () => {
    const params = useParams()
    const { activate } = useContext(AuthContext)
    const [isActivated, setIsActivated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        activate(params.uid, params.token)
            .then(setIsActivated(true))
            .catch(err => setError(err))
            .finally(setLoading(false))
    }, [params.uid, params.token, activate])

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center align-items-center text-center'>
            {loading && <h1>Пожалуйста подождите...</h1>}
            {isActivated ? (
                <>
                    <h1>Аккаунт активирован!</h1>
                    <Link to='/login' className='btn btn-primary' role='button'>
                        Войти
                    </Link>
                </>
            ) : (
                <>
                    <h1>Что-то пошло не так...</h1>
                    <span>{error.response}</span>
                </>
            )}
        </div>
    )
}

export default Activate