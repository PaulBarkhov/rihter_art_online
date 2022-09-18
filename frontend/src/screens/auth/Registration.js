import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../context/AuthContext'
import { EyeFill } from 'react-bootstrap-icons'
import { EyeSlashFill } from 'react-bootstrap-icons'
import Spinner from 'react-bootstrap/Spinner'

const Registration = () => {
    const { signup, en } = useContext(AuthContext)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })

    const [visibility, setVisibility] = useState({
        password: false,
        re_password: false
    })

    const [re_password, setRepeatPassword] = useState('')
    const [isChecked, setIsChecked] = useState(false)

    const [errors, setErrors] = useState({
        server: '',
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        re_password: '',
        check: ''
    })

    const handleSubmit = async e => {
        e.preventDefault()
        if (!loading) {
            setErrors({
                server: '',
                first_name: !userData.first_name ? (en ? 'Enter first name' : 'Введите имя') : errors.first_name,
                last_name: !userData.last_name ? (en ? 'Enter last name' : 'Введите фамилию') : errors.last_name,
                email: !userData.email ? (en ? 'Enter email' : 'Введите Email') : errors.email,
                username: !userData.email ? '' : errors.username,
                // birthDate: !userData.birthDate ?'Введите Дату рождения' : errors.birthDate,
                // language: !userData.language ?'Выберите язык' : errors.language,
                password: !userData.password ? (en ? 'Enter password' : 'Введите пароль') : errors.password,
                re_password: !re_password ? (en ? 'Repeat password' : 'Повторите пароль') : errors.re_password,
                check: !isChecked ? (en ? 'Acceptance required' : 'Подтвердите согласие') : errors.check,
            })
            if (userData.first_name && !errors.first_name &&
                userData.last_name && !errors.last_name &&
                userData.email && !errors.email && !errors.username &&
                userData.password && !errors.password &&
                !errors.re_password &&
                !errors.check
            ) {
                setLoading(true)
                signup(userData)
                    .then(res => {
                        navigate('/verification')
                    })
                    .catch(err => {
                        setErrors(err.response.data)
                        console.log('Sign up failed')
                    })
                    .finally(() => setLoading(false))
            }
        }
    }

    const validate = (inputName, inputValue) => {
        const format = /^[a-zа-я ,.'-]+$/i

        switch (inputName) {
            case 'first_name':

                // setUserData({ ...userData, first_name: inputValue.replace(format, '') })
                if (format.test(inputValue) || inputValue === '') {
                    setErrors({ ...errors, first_name: '' })
                    setUserData({ ...userData, first_name: inputValue })
                }
                break

            case 'last_name':
                if (format.test(inputValue) || inputValue === '') {
                    setErrors({ ...errors, last_name: '' })
                    setUserData({ ...userData, last_name: inputValue })
                }
                break
            case 'email':
                const emailFormat = /^[a-z0-9@_.-]+$/i
                if (emailFormat.test(inputValue) || inputValue === '') {
                    setErrors({ ...errors, email: '', username: '' })
                    setUserData({ ...userData, email: inputValue.toLowerCase() })
                }
                break
            case 'password':
                setUserData({ ...userData, password: inputValue })
                if (errors.password === 'Укажите пароль' || errors.password === 'Enter password' || inputValue.length >= 8) setErrors({ ...errors, password: '' })
                if (inputValue === re_password) setErrors({ ...errors, password: '', re_password: '' })
                break
            case 're_password':
                setRepeatPassword(inputValue)
                if (errors.re_password === 'Повторите пароль' || errors.re_password === 'Repeat password') setErrors({ ...errors, re_password: '' })
                if (inputValue === userData.password) setErrors({ ...errors, re_password: '' })
                break
            default: break
        }
    }

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-12 col-md-8 d-flex flex-column justify-content-center align-items-center shadow p-5 bg-white rounded'>
                <img src={logo} alt='logo' style={{ width: 180, height: 180 }} />
                <div style={{ minHeight: 30, paddingInline: 10, color: 'red' }}>
                    {errors.server && <span style={styles.error}>{errors.server}</span>}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='d-flex flex-column'>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <input
                                    className={`form-control ${errors.first_name && 'is-invalid'}`}
                                    name='first_name'
                                    type='text'
                                    placeholder={en ? 'First name' : 'Имя'}
                                    maxLength={50}
                                    value={userData.first_name}
                                    onChange={e => validate(e.target.name, e.target.value)}
                                />
                                {errors.first_name && <div className='invalid-feedback'>{errors.first_name}</div>}
                            </div>

                            <div style={styles.formGroup}>
                                <input
                                    className={`form-control ${errors.last_name && 'is-invalid'}`}
                                    name='last_name'
                                    type='text'
                                    placeholder={en ? 'Last name' : 'Фамилия'}
                                    maxLength={50}
                                    value={userData.last_name}
                                    onChange={e => validate(e.target.name, e.target.value)}
                                />
                                {errors.last_name && <div className='invalid-feedback'>{errors.last_name}</div>}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <input
                                className={`form-control ${(errors.email || errors.username) && 'is-invalid'}`}
                                name='email'
                                type='email'
                                placeholder={en ? 'Email' : 'Электронная почта'}
                                maxLength={62}
                                value={userData.email}
                                onChange={e => validate(e.target.name, e.target.value)}
                                onBlur={() => {
                                    const emailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                                    if (userData.email && !emailFormat.test(userData.email)) setErrors({ ...errors, email: en ? 'Wrong email' : 'Неправильный email' })
                                    else setErrors({ ...errors, email: '' })
                                }}
                            />
                            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                            {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
                        </div>

                        <div style={styles.formGroup}>
                            <input
                                className={`form-control ${errors.password && 'is-invalid'}`}
                                name='password'
                                type={visibility.password ? 'text' : 'password'}
                                placeholder={en ? 'Password' : 'Пароль'}
                                maxLength={256}
                                value={userData.password}
                                onChange={e => validate(e.target.name, e.target.value)}
                                onBlur={() => {
                                    if (userData.password.length !== 0 && userData.password.length < 8) setErrors({ ...errors, password: en ? 'At least 8 symbols' : 'Минимум 8 символов' })
                                }} />

                            <div
                                style={{
                                    position: 'absolute',
                                    paddingBlock: 3,
                                    paddingInline: 5,
                                    top: 14,
                                    right: 9,
                                    background: 'white'
                                }}
                                onClick={() => {
                                    setVisibility({ ...visibility, password: !visibility.password })
                                }}
                            >
                                {visibility.password ? <EyeSlashFill /> : <EyeFill />}
                            </div>

                            {errors.password && <div className='invalid-feedback'>{errors.password}</div>}

                        </div>

                        <div style={styles.formGroup}>

                            <input
                                className={`form-control ${errors.re_password && 'is-invalid'}`}
                                name='re_password'
                                type={visibility.re_password ? 'text' : 'password'}
                                placeholder={en ? 'Repeat password' : 'Повторите пароль'}
                                maxLength={256}
                                value={re_password}
                                onChange={e => validate(e.target.name, e.target.value)}
                                onBlur={() => {
                                    if (re_password && re_password !== userData.password) setErrors({ ...errors, re_password: en ? 'Passwords do not match' : 'Пароли не совпадают' })
                                }}
                            />

                            <div
                                style={{
                                    position: 'absolute',
                                    paddingBlock: 3,
                                    paddingInline: 5,
                                    top: 14,
                                    right: 9,
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
                        <div style={styles.formGroup}>
                            <div className='form-check'>
                                <input
                                    className={`form-check-input ${errors.check && 'is-invalid'}`}
                                    id='permissionCheckBox'
                                    type='checkbox'
                                    onChange={e => {
                                        setIsChecked(e.target.checked)
                                        if (e.target.checked) setErrors({ ...errors, check: '' })
                                    }}
                                />
                                <label className='form-check-label' htmlFor='permissionCheckBox'>{en ? 'I consent to receive emails' : 'Согласие на получение рассылок по почте'}</label>
                                {errors.check && <div className='invalid-feedback'>{errors.check}</div>}
                            </div>
                        </div>

                        <button className='btn btn-primary m-1 btn-block' type='submit'>
                            {loading && <Spinner animation="border" size="sm" />}
                            {en ? ' Sign up' : ' Зарегистрироваться'}
                        </button>
                        <div style={{ width: '100%', textAlign: 'center' }}><span>{en ? 'Already have an account? ' : 'Уже есть аккаунт? '}<Link to='/login'>{en ? 'Sign in' : 'Войти'}</Link></span></div>
                        <Link className='w-100 text-center' to='/resend_activation_link'>{en ? 'Resend activation link' : 'Запросить ссылку для активации'}</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration

const styles = {
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    error: {
        height: 30
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '10px 5px',
        flex: 1,
        minWidth: 250
    },
}