import React, { useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ResetPasswordConfirm = () => {
    const navigate = useNavigate()
    const { setNewPassword } = useContext(AuthContext)
    const { uid, token } = useParams()

    const [isChanged, setIsChanged] = useState(false)

    const [userData, setUserData] = useState({
        password: '',
        re_password: ''
    })

    const [errors, setErrors] = useState({
        server: '',
        password: '',
        re_password: '',
        match: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        setErrors({
            ...errors,
            server: '',
            password: !userData.password ? 'Пожалуйста, введите новый пароль' : '',
            re_password: !userData.re_password ? 'Пожалуйста, повторите пароль' : '',
            match: userData.password && userData.re_password && userData.password !== userData.re_password ? 'Пароли не совпадают' : ''
        })
        if (userData.password && !errors.password &&
            userData.re_password && !errors.re_password &&
            !errors.server && !errors.match &&
            userData.password === userData.re_password) {
            setNewPassword(uid, token, userData.password)
                .then(res => setIsChanged(true))
                .catch(err => console.log(err.response.data))
        }
    }

    if (isChanged) return (
        <div className='d-flex flex-column min-vh-100 justify-content-center align-items-center'>
            <h1>Пароль успешно изменен!</h1>
            <button className='btn btn-primary mt-3' onClick={() => navigate('/login')}>Войти</button>
        </div>
    )

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-12 col-md-5 d-flex flex-column justify-content-center align-items-center shadow px-5 pt-5 pb-4 bg-white rounded'>
                <h1 className='mb-3'>Новый пароль</h1>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className='form-group mb-2'>
                        <input
                            type='password'
                            className={`form-control ${errors.password && 'is-invalid'}`}
                            name='password' placeholder='Пароль*'
                            onChange={e => {
                                setUserData({ ...userData, password: e.target.value })
                                setErrors({
                                    ...errors,
                                    server: '',
                                    password: '',
                                    match: userData.password === userData.re_password && ''
                                })
                            }} />
                        {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                    </div>
                    <div className='form-group mb-2'>
                        <input
                            type='password'
                            className={`form-control ${errors.re_password && 'is-invalid'}`}
                            name='re_password'
                            placeholder='Повторите пароль*'
                            onChange={e => {
                                setUserData({ ...userData, re_password: e.target.value })
                                setErrors({
                                    ...errors,
                                    server: '',
                                    re_password: '',
                                    match: userData.password === userData.re_password && ''
                                })
                            }} />
                        {errors.re_password && <div className='invalid-feedback'>{errors.re_password}</div>}
                    </div>
                    <button type='submit' className='btn btn-primary w-100'>Готово</button>
                    <div style={{ minHeight: 25, textAlign: 'center', color: 'red', marginTop: '1rem' }}>
                        {errors.match && <span>{errors.match}</span>}
                        {errors.server && <span>{errors.server}</span>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordConfirm