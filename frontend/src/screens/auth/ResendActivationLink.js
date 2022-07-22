import React, { useState, useContext } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ResendActivationLink = () => {
    const { userData, resendActivationEmail, en } = useContext(AuthContext)
    const [email, setEmail] = useState(userData.email || '')
    const [isResended, setIstResended] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = e => {
        e.preventDefault()
        if (!loading) {
            setLoading(true)
            resendActivationEmail(email)
                .then(res => navigate('/verification'))
                .catch(err => console.log(err.response))
                .finally(() => setLoading(false))
        }
    }

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-lg-5 d-flex flex-column justify-content-center align-items-center shadow px-5 pt-5 pb-4 bg-white rounded'>

                <h1>{en ? 'Enter Email' : 'Введите Email'}</h1>
                <p>{en ? 'We will send the activation link' : 'Мы вышлем вам код для активации'}</p>

                <form onSubmit={e => handleSubmit(e)}>
                    <div className='input-group mb-3'>
                        <input
                            className={`form-control ${error && 'is-invalid'}`}
                            name='username'
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={e => {
                                setError('')
                                setEmail(e.target.value.toLowerCase())
                            }}
                        />
                        <div className='input-group-append'>
                            <button
                                type='submit'
                                className='btn btn-outline-primary'>
                                {loading ? <Spinner animation="border" size="sm" /> : 'OK'}
                            </button>
                        </div>
                        {/* {error && <div className='invalid-feedback'>{error}</div>} */}
                    </div>

                    {error && <span className='text-danger'>{error}</span>}

                </form>

                <div className='w-100 text-center'>{en ? 'Already activated? ' : 'Уже активировали? '}<Link to='/registration'>{en ? 'Login' : 'Войти'}</Link></div>
            </div>
        </div>
    )
}

export default ResendActivationLink
