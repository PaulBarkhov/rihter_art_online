import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const { login } = React.useContext(AuthContext)

    const [userData, setUserData] = React.useState({
        username: '',
        password: '',
    })

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
        <div className='min-vh-100 d-flex justify-content-center align-items-center'>
            <div className="col-lg-5 d-flex flex-column flex-wrap justify-content-center shadow p-5 bg-white rounded" >
                <div className='d-flex align-items-center justify-content-center'>
                    <img src={logo} alt="logo" style={{ width: 200, height: 200, margin: 30 }} />
                </div>
                <div className="d-flex flex-column justify-content-center text-center">
                    <h2 className='mb-3'>Логин</h2>
                    <span>{errors.server}</span>
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
                                    setUserData({ ...userData, username: e.target.value })
                                }}
                            />
                            <input
                                className="form-control mb-3"
                                name="password"
                                type="password"
                                placeholder={errors.password ? 'Введите пароль*' : 'Пароль*'}
                                value={userData.password}
                                onChange={e => {
                                    setErrors({ ...errors, server: '', password: '' })
                                    setUserData({ ...userData, password: e.target.value })
                                }}
                            />
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

