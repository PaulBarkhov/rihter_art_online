import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Verification = () => {
    const { userData, en } = useContext(AuthContext)
    const navigate = useNavigate()

    if (!userData) navigate('/resend_activation_link')

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
            <div className='col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center text-center'>
                {en ?
                    <>
                        <h2>We sent the activation link to {userData.email}</h2>
                        <span>Apparently you will have to check your spam folder</span>
                    </>
                    :
                    <>
                        <h2>Мы отправили на {userData.email} ссылку для активации аккаунта</h2>
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
                        onClick={() => navigate('/resend_activation_link')}>
                        {en ? ' Ain`t got the letter' : ' Я не получил письмо'}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Verification
