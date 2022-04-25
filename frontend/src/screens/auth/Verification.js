import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
    const { userData, register } = useContext(AuthContext)
    const navigate = useNavigate()
    const [code, setCode] = useState([...Array(4)].map(() => ""))
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState(false)
    const inputs = useRef([])

    if (isVerified) return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
            <h1 className='mb-4'>Вы успешно зарегистрировались!</h1>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Войти</button>
        </div>
    )

    return (
        <div className='d-flex min-vh-100 justify-content-center align-items-center'>
            <div className='col-md-6 d-flex flex-column justify-content-center align-items-center shadow p-5 bg-white rounded'>
                <h1>Введите код</h1>
                <div style={{ minHeight: 30, textAlign: 'center', color: 'red' }}>
                    {error && <p>{error}</p>}
                </div>
                <div className="d-flex flex-row justify-content-evenly">
                    {code.map((num, index) => {
                        return (
                            <input
                                // style={styles.codeInput}
                                className="col-2 rounded shadow-sm border border-2 text-center"
                                key={index}
                                value={code[index]}
                                type='text'
                                inputMode='numeric'
                                maxLength='1'
                                autoFocus={index === 0}
                                onChange={e => {
                                    const newCode = [...code]
                                    newCode[index] = e.target.value
                                    setCode(newCode)
                                    if (e.target.value && index < 3) inputs.current[index + 1].focus()

                                    if (index === 3 && newCode[3]) {
                                        register(newCode.join(''))
                                            .then(setIsVerified(true))
                                            .catch(err => setError(err.response.data.error))
                                    }

                                }}
                                onKeyDown={e => {
                                    if (e.key === "Backspace") {
                                        if (!code[index] && index > 0) inputs.current[index - 1].focus()
                                    }
                                }}
                                ref={ref => inputs.current.push(ref)}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Verification
