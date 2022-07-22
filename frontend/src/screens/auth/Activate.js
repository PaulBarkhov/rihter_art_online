import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useParams, Link } from 'react-router-dom'

const Activate = () => {
    const params = useParams()
    const { activate, en } = useContext(AuthContext)
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
            {loading && <h1>{en ? 'Loading...' : 'Пожалуйста подождите...'}</h1>}
            {isActivated ? (
                <>
                    <h1>{en ? 'Account activated' : 'Аккаунт активирован!'}</h1>
                    <Link to='/login' className='btn btn-primary' role='button'>
                        {en ? 'Sign in' : 'Войти'}
                    </Link>
                </>
            ) : (
                <>
                    <h1>{en ? 'Something went wrong...' : 'Что-то пошло не так...'}</h1>
                    <span>{error.response}</span>
                </>
            )}
        </div>
    )
}

export default Activate