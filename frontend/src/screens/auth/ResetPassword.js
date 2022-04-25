import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const ResetPassword = ({ navigation, route }) => {
    const { request_reset_code } = useContext(AuthContext)
    const [email, setEmail] = useState()
    const [error, setError] = useState('')

    const handleClick = () => {
        if (!email) setError('Введите Email')
        else request_reset_code(email)
            .then(navigation.navigate('resetVerification'))
            .catch(error => setError('Ошибка: ' + error))
    }

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-md-6 d-flex flex-column justify-content-center align-items-center shadow px-5 pt-5 pb-4 bg-white rounded'>
                <h1>Введите Email</h1>
                <p>Мы вышлем вам код для сброса пароля</p>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        placeholder='Email'
                        className="form-control"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleClick}>
                            OK
                        </button>
                    </div>
                </div>
                <div style={{ minHeight: 25, color: "red", textAlign: 'center' }}>
                    {error && <span>{error}</span>}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword

