import React, { useState } from 'react'
import { EyeFill, EyeSlash, EyeSlashFill } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import PasswordVisibility from '../../components/PasswordVisibility'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
    const { login } = React.useContext(AuthContext)

    const [userData, setUserData] = React.useState({
        username: '',
        password: '',
    })

    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const [errors, setErrors] = React.useState({
        server: '',
        username: '',
        password: ''
    })

    const handleSubmit = e => {
        e.preventDefault()
        setErrors({
            server: '',
            username: !userData.username ? 'Введите Email' : '',
            password: !userData.password ? 'Введите Пароль?' : ''
        })
        if (userData.username && userData.password) {
            login({ ...userData })
                .catch(err => setErrors({
                    ...errors,
                    server: err.response.status === 401 ? 'Неправильное имя пользователя или пароль' : err
                }))
        }
    }

    return (
        <div className='min-vh-100 d-flex flex-column justify-content-center align-items-center'>
            <div className="col-12 col-md-8 col-lg-5 d-flex flex-column flex-wrap justify-content-center shadow p-5 bg-white rounded" >
                <div className='d-flex align-items-center justify-content-center mb-4'>
                    <img src={logo} alt="logo" style={{ width: 200, height: 200 }} />
                </div>
                <div className="d-flex flex-column justify-content-center text-center">
                    <span className="text-danger">{errors.server}</span>
                    <form onSubmit={e => handleSubmit(e)}>
                        <div className='form-group d-flex flex-column'>
                            <input
                                className="form-control mb-3"
                                name="username"
                                type="email"
                                placeholder={errors.username ? 'Введите Email*' : 'Email*'}
                                value={userData.username}
                                onChange={e => {
                                    setErrors({ ...errors, server: '', username: '' })
                                    setUserData({ ...userData, username: e.target.value.toLowerCase() })
                                }}
                            />
                            <div className="input-group mb-3">
                                <input
                                    className="form-control"
                                    name="password"
                                    type={isPasswordShown ? "text" : "password"}
                                    placeholder={errors.password ? 'Введите пароль*' : 'Пароль*'}
                                    value={userData.password}
                                    onChange={e => {
                                        setErrors({ ...errors, server: '', password: '' })
                                        setUserData({ ...userData, password: e.target.value })
                                    }}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text bg-white">
                                        <label className="control-label" htmlFor="password">
                                            {isPasswordShown ? <EyeSlashFill /> : <EyeFill />}
                                        </label>
                                        <input
                                            type="checkbox"
                                            style={{ display: 'none' }}
                                            name="password"
                                            id="password"
                                            onChange={() => setIsPasswordShown(!isPasswordShown)} />
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary btn-block mb-3" type="submit">Войти</button>
                        </div>
                    </form>
                    <span>Нет аккаунта? <Link to="/registration">Регистрация</Link></span>
                    <Link to="/reset_password">Забыли пароль?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login

