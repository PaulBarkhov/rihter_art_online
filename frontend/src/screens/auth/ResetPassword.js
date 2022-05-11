import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ResetPassword = () => {
    const { resetPassword } = useContext(AuthContext)
    const [email, setEmail] = useState()
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = e => {
        e.preventDefault()
        if (!email) setError('Введите Email')
        else resetPassword(email)
            .then(res => navigate('/reset_password_sent'))
            .catch(err => {
                err.response.status === 400 ? setError('Ошибка: Введенный вами Email не найден в базе данных') : setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз позже')
            })
    }

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-md-5 d-flex flex-column justify-content-center align-items-center shadow px-5 pt-5 pb-4 bg-white rounded'>
                <h1>Введите Email</h1>
                <p>Мы вышлем вам код для сброса пароля</p>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="input-group mb-3">
                        <input
                            type="email"
                            placeholder='Email'
                            className="form-control"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary">OK</button>
                        </div>
                    </div>
                </form>
                <div style={{ minHeight: 25, color: "red", textAlign: 'center' }}>
                    {error && <span>{error}</span>}
                </div>
                <Link to="/login">Вспомнили пароль?</Link>
            </div>
        </div>
    )
}

export default ResetPassword

