import React, { useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { EyeFill } from 'react-bootstrap-icons'
import { EyeSlashFill } from 'react-bootstrap-icons'

const ResetPasswordConfirm = () => {
    const navigate = useNavigate()
    const { setNewPassword, en } = useContext(AuthContext)
    const { uid, token } = useParams()

    const [isChanged, setIsChanged] = useState(false)

    const [userData, setUserData] = useState({
        password: '',
        re_password: ''
    })

    const [visibility, setVisibility] = useState({
        password: false,
        re_password: false
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
            password: !userData.password ? (en ? 'Enter new password' : 'Введите новый пароль') : '',
            re_password: !userData.re_password ? (en ? 'Repeat password' : 'Повторите пароль') : '',
            match: userData.password && userData.re_password && userData.password !== userData.re_password ? (en ? 'Passwords do not match' : 'Пароли не совпадают') : ''
        })
        if (userData.password && !errors.password &&
            userData.re_password && !errors.re_password &&
            !errors.server && !errors.match &&
            userData.password === userData.re_password) {
            setNewPassword(uid, token, userData.password)
                .then(res => setIsChanged(true))
        }
    }

    if (isChanged) return (
        <div className='d-flex flex-column min-vh-100 justify-content-center align-items-center'>
            <h1>{en ? 'Password set!' : 'Пароль успешно изменен!'}</h1>
            <button className='btn btn-primary mt-3' onClick={() => navigate('/login')}>{en ? 'Sign in' : 'Войти'}</button>
        </div>
    )

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-12 col-md-5 d-flex flex-column justify-content-center align-items-center shadow px-5 pt-5 pb-4 bg-white rounded'>
                <h1 className='mb-3'>{en ? 'New password' : 'Новый пароль'}</h1>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className='form-group mb-2 position-relative'>
                        <input
                            type={visibility.password ? 'text' : 'password'}
                            className={`form-control ${errors.password && 'is-invalid'}`}
                            name='password'
                            placeholder={en ? 'Password*' : 'Пароль*'}
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

                        <div
                            style={{
                                position: 'absolute',
                                paddingBlock: 3,
                                paddingInline: 5,
                                top: 4,
                                right: 4,
                                background: 'white'
                            }}
                            onClick={() => {
                                setVisibility({ ...visibility, password: !visibility.password })
                            }}
                        >
                            {visibility.password ? <EyeSlashFill /> : <EyeFill />}
                        </div>

                    </div>

                    <div className='form-group mb-2 posiiton-relative'>
                        <input
                            type={visibility.re_password ? 'text' : 'password'}
                            className={`form-control ${errors.re_password && 'is-invalid'}`}
                            name='re_password'
                            placeholder={en ? 'Repeat password*' : 'Повторите пароль*'}
                            onChange={e => {
                                setUserData({ ...userData, re_password: e.target.value })
                                setErrors({
                                    ...errors,
                                    server: '',
                                    re_password: '',
                                    match: userData.password === userData.re_password && ''
                                })
                            }} />

                        <div
                            style={{
                                position: 'absolute',
                                paddingBlock: 3,
                                paddingInline: 5,
                                top: 4,
                                right: 4,
                                background: 'white'
                            }}
                            onClick={() => {
                                setVisibility({ ...visibility, re_password: !visibility.re_password })
                            }}
                        >
                            {visibility.re_password ? <EyeSlashFill /> : <EyeFill />}
                        </div>

                        {errors.re_password && <div className='invalid-feedback'>{errors.re_password}</div>}
                    </div>
                    <button type='submit' className='btn btn-primary w-100'>{en ? 'Done' : 'Готово'}</button>
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