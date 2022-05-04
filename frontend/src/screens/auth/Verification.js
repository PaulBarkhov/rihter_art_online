import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Verification = () => {
    const { userData, resendActivationEmail } = useContext(AuthContext)
    const [isResended, setIstResended] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleClick = () => {
        resendActivationEmail()
            .then(res => setIstResended(true))
            .catch(err => setError(err.response.data))
    }

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center text-left'>
            <span className='text-primary' onClick={() => navigate(-1)}><u>Назад</u></span>
            <div className="d-flex flex-column justify-content-center align-items-center text-center">
                <h2>Мы отправили на {userData.email} ссылку для активации аккаунта</h2>
                <span>Возможно придется проверить папку "спам"</span>
                <button disabled={isResended} className="btn btn-outline-primary my-4" onClick={handleClick}>{isResended ? "Отправлено" : "Я не получил письмо"}</button>
                {error && <span className="text-danger">{error}</span>}
            </div>
        </div>
    )
}

export default Verification
