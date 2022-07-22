import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ResetPasswordSent = () => {

    const { userData, resetPassword, en } = useContext(AuthContext)
    const [isResended, setIstResended] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleClick = () => {
        resetPassword(userData.email)
            .then(res => setIstResended(true))
            .catch(err => console.error(err))
        // .catch(err => setError(err.response.data))
    }

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center text-left'>
            <div className='d-flex flex-column justify-content-center align-items-center text-center'>
                {en ?
                    <>
                        <h2>We sent a password reset link to {userData.email}</h2>
                        <span>Apparently you will have to check your spam folder</span>
                    </>
                    :
                    <>
                        <h2>Мы отправили на {userData.email} ссылку для сброса пароля</h2>
                        <span>Возможно придется проверить папку 'спам'</span>
                    </>
                }
                <div className='d-flex flex-row mt-2'>

                    <button
                        className='btn btn-outline-secondary mx-1'
                        onClick={() => navigate(-1)}>
                        {en ? 'Back' : 'Назад'}
                    </button>

                    <button
                        className='btn btn-outline-primary mx-1'
                        disabled={isResended}
                        onClick={handleClick}>
                        {isResended ? (en ? 'Sent' : 'Отправлено') : (en ? 'Ain`t got the letter' : 'Я не получил письмо')}
                    </button>

                </div>
                {error && <span className='text-danger'>{error}</span>}
            </div >
        </div >
    )
}

export default ResetPasswordSent