import React, { useState, useContext } from 'react'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'

const Login = () => {
    const { login, en } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)

    const [userData, setUserData] = useState({
        username: '',
        password: '',
    })

    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const [errors, setErrors] = useState({
        server: '',
        username: '',
        password: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        if (!loading) {
            setErrors({
                server: '',
                username: !userData.username ? (en ? 'Enter email' : 'Введите email') : '',
                password: !userData.password ? (en ? 'Enter password' : 'Введите Пароль') : ''
            })
            if (userData.username && userData.password) {
                setLoading(true)
                login({ ...userData })
                    .catch(err => setErrors({
                        ...errors,
                        server: err.response.status === 401 ? (en ? 'Wrong email or password' : 'Неправильное имя пользователя или пароль') : err
                    }))
                    .finally(() => setLoading(false))
            }
        }
    }

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
            <div className='col-12 col-md-8 col-lg-5 d-flex flex-column flex-wrap justify-content-center shadow p-5 bg-white rounded' >
                <div className='d-flex align-items-center justify-content-center mb-4'>
                    <img src={logo} alt='logo' style={{ width: 200, height: 200 }} />
                </div>
                <div className='d-flex flex-column justify-content-center'>
                    <span className='text-danger text-center'>{errors.server}</span>
                    <form onSubmit={e => handleSubmit(e)}>

                        <div className='form-group mb-3'>
                            <input
                                className={`form-control ${errors.username && 'is-invalid'}`}
                                name='username'
                                type='email'
                                placeholder='Email'
                                value={userData.username}
                                onChange={e => {
                                    setErrors({ ...errors, server: '', username: '' })
                                    setUserData({ ...userData, username: e.target.value.toLowerCase() })
                                }}
                            />
                            {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
                        </div>

                        <div className="form-group mb-3 position-relative">

                            <input
                                className={`form-control ${errors.password && 'is-invalid'}`}
                                name='password'
                                type={isPasswordShown ? 'text' : 'password'}
                                placeholder={en ? 'Password*' : 'Пароль'}
                                value={userData.password}
                                onChange={e => {
                                    setErrors({ ...errors, server: '', password: '' })
                                    setUserData({ ...userData, password: e.target.value })
                                }}
                            />

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
                                    setIsPasswordShown(!isPasswordShown)
                                }}
                            >
                                {isPasswordShown ? <EyeSlashFill /> : <EyeFill />}
                            </div>

                            {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                        </div>

                        <button className='btn btn-primary btn-block mb-3 w-100' type='submit'>
                            {loading && <Spinner animation="border" size="sm" />}
                            {en ? ' Login' : ' Войти'}
                        </button>

                    </form>
                    <div className='text-center '>
                        <span>{en ? 'Don`t have an account yet? ' : 'Нет аккаунта? '}
                            <Link to='/registration'>
                                {en ? 'Sign up' : 'Регистрация'}
                            </Link>
                        </span><br />
                        <Link to='/reset_password'>{en ? 'Forgot password?' : 'Забыли пароль?'}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

