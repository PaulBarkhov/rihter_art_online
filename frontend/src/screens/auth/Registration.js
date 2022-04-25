import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import logo from '../../assets/logo.png'
import GlobalStyles from '../../GlobalStyles'
import { AuthContext } from '../../context/AuthContext'

import { View, Image, Text, TextInput, TouchableOpacity } from '../../components/react-native'
import CodeInput from '../../components/CodeInput'
import Verification from './Verification'


const Registration = () => {
    const { request_verification_code } = useContext(AuthContext)
    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const [repeatPassword, setRepeatPassword] = React.useState('')
    const [isChecked, setIsChecked] = React.useState(false)

    const [errors, setErrors] = React.useState({
        server: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        check: ''
    })

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({
            server: '',
            firstName: !userData.firstName ? 'Введите имя' : errors.firstName,
            lastName: !userData.lastName ? 'Введите фамилию' : errors.lastName,
            email: !userData.email ? 'Введите Email' : errors.email,
            // birthDate: !userData.birthDate ?'Введите Дату рождения' : errors.birthDate,
            // language: !userData.language ?'Выберите язык' : errors.language,
            password: !userData.password ? 'Введите пароль' : errors.password,
            repeatPassword: !repeatPassword ? 'Повторите пароль' : errors.repeatPassword,
            check: !isChecked ? 'Подтвердите согласие' : errors.check,
        })
        if (userData.firstName && !errors.firstName &&
            userData.lastName && !errors.lastName &&
            userData.email && !errors.email &&
            userData.password && !errors.password &&
            !errors.repeatPassword &&
            !errors.check
        ) {
            // await axios.post(`${process.env.REACT_APP_API_URL}/authentication/send_verification_code`, { ...userData })
            request_verification_code(userData)
                .then(res => {
                    console.log(res)
                    navigate("/verification")
                })
                .catch(err => {
                    if (err.response.status === 409) setErrors({ ...errors, email: err.response.data.error })
                    else setErrors({ ...errors, server: err.response.data.error })
                })
        }
    }

    const validate = (inputName, inputValue) => {
        const format = /^[a-zа-я ,.'-]+$/i

        switch (inputName) {
            case 'firstName':

                // setUserData({ ...userData, firstName: inputValue.replace(format, '') })
                if (format.test(inputValue) || inputValue === '') {
                    setErrors({ ...errors, firstName: '' })
                    setUserData({ ...userData, firstName: inputValue })
                }
                break

            case 'lastName':
                if (format.test(inputValue) || inputValue === '') {
                    setErrors({ ...errors, lastName: '' })
                    setUserData({ ...userData, lastName: inputValue })
                }
                break
            case 'email':
                const emailFormat = /^[a-z0-9@_.-]+$/i
                if (emailFormat.test(inputValue) || inputValue === '') {
                    setErrors({ ...errors, email: "" })
                    setUserData({ ...userData, email: inputValue })
                }
                break
            case 'password':
                setUserData({ ...userData, password: inputValue })
                if (errors.password === "Укажите пароль" || inputValue.length >= 8) setErrors({ ...errors, password: '' })
                if (inputValue === repeatPassword) setErrors({ ...errors, password: '', repeatPassword: '' })
                break
            case 'repeatPassword':
                setRepeatPassword(inputValue)
                if (errors.repeatPassword === 'Повторите пароль') setErrors({ ...errors, repeatPassword: '' })
                if (inputValue === userData.password) setErrors({ ...errors, repeatPassword: '' })
                break
            default: break
        }
    }

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-md-8 d-flex flex-column justify-content-center align-items-center shadow p-5 bg-white rounded'>
                <img src={logo} alt="logo" style={{ width: 200, height: 200, marginBottom: 10 }} />
                <h2>Регистрация</h2>
                <div style={{ minHeight: 30, paddingInline: 10, color: 'red' }}>
                    {errors.server && <span style={styles.error}>{errors.server}</span>}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='d-flex flex-column'>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <input
                                    className={`form-control ${errors.firstName && 'is-invalid'}`}
                                    name="firstName"
                                    type="text"
                                    placeholder="Имя"
                                    maxLength={50}
                                    value={userData.firstName}
                                    onChange={e => validate(e.target.name, e.target.value)}
                                />
                                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
                            </div>

                            <div style={styles.formGroup}>
                                <input
                                    className={`form-control ${errors.lastName && 'is-invalid'}`}
                                    name="lastName"
                                    type="text"
                                    placeholder="Фамилия"
                                    maxLength={50}
                                    value={userData.lastName}
                                    onChange={e => validate(e.target.name, e.target.value)}
                                />
                                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <input
                                className={`form-control ${errors.email && 'is-invalid'}`}
                                name='email'
                                type='email'
                                placeholder='Электронная почта'
                                maxLength={62}
                                value={userData.email}
                                onChange={e => validate(e.target.name, e.target.value)}
                                onBlur={() => {
                                    const emailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
                                    if (userData.email && !emailFormat.test(userData.email)) setErrors({ ...errors, email: "Неправильный email" })
                                    else setErrors({ ...errors, email: '' })
                                }}
                            />
                            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                        </div>

                        <div style={styles.formGroup}>
                            <input
                                className={`form-control ${errors.password && 'is-invalid'}`}
                                name='password'
                                type='password'
                                placeholder='Пароль'
                                maxLength={256}
                                value={userData.password}
                                onChange={e => validate(e.target.name, e.target.value)}
                                onBlur={() => {
                                    if (userData.password.length !== 0 && userData.password.length < 8) setErrors({ ...errors, password: 'Минимум 8 символов' })
                                }} />
                            {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                        </div>
                        <div style={styles.formGroup}>
                            <input
                                className={`form-control ${errors.repeatPassword && 'is-invalid'}`}
                                name='repeatPassword'
                                type='password'
                                placeholder='Повторите пароль'
                                maxLength={256}
                                value={repeatPassword}
                                onChange={e => validate(e.target.name, e.target.value)}
                                onBlur={() => {
                                    if (repeatPassword && repeatPassword !== userData.password) setErrors({ ...errors, repeatPassword: 'Пароли не совпадают' })
                                }}
                            />
                            {errors.repeatPassword && <div className='invalid-feedback'>{errors.repeatPassword}</div>}
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
                                <label className='form-check-label' htmlFor='permissionCheckBox'>Согласие на получение рассылок по почте</label>
                                {errors.check && <div className='invalid-feedback'>{errors.check}</div>}
                            </div>
                        </div>

                        <button className='btn btn-primary m-1 btn-block' type='submit'>Зарегистрироваться</button>
                        <div style={{ width: '100%', textAlign: 'center' }}><span>Уже есть аккаунт? <Link to="/login">Войти</Link></span></div>

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