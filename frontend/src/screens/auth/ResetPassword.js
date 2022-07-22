import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'

const ResetPassword = () => {
    const { resetPassword, en } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = e => {
        e.preventDefault()
        if (!loading) {
            if (!email) setErrors({ ...errors, email: e ? ['Enter email'] : ['Введите Email'] })
            else if (errors.email.length === 0) {
                setLoading(true)
                resetPassword(email)
                    .then(res => navigate('/reset_password_sent'))
                    // .catch(err => console.log(err.response.data))
                    .catch(err => setErrors(err.response.data))
                    // .catch(err => setError(en ? 'Something went wrong. Please try again later' : 'Что-то пошло не так. Пожалуйста, попробуйте еще раз позже'))
                    .finally(() => setLoading(false))
            }
        }
    }

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-md-5 d-flex flex-column justify-content-center align-items-center shadow px-5 pt-5 pb-4 bg-white rounded'>
                <h1>{en ? 'Enter Email' : 'Введите Email'}</h1>
                <p>{en ? 'We will send the password reset link' : 'Мы вышлем вам код для сброса пароля'}</p>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className='input-group mb-3'>
                        <input
                            type='email'
                            placeholder='Email'
                            className={`form-control ${errors.email && 'is-invalid'}`}
                            onChange={e => {
                                setEmail(e.target.value)
                                setErrors({ ...errors, email: '' })
                            }}
                        />
                        <div className='input-group-append'>
                            <button
                                type='submit'
                                className={`btn ${errors.email ? 'btn-outline-danger' : 'btn-outline-primary'}`}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'OK'}
                            </button>
                        </div>
                        {errors.email && <div className='invalid-feedback'>fsdfds</div>}
                        {/* {errors.email && <div className='invalid-feedback'>{errors.email.map(error => <span key={error}>{error}</span>)}</div>} */}

                    </div>
                </form>

                <Link to='/login'>{en ? 'Remember your password?' : 'Вспомнили пароль?'}</Link>
            </div>
        </div>
    )
}

export default ResetPassword

