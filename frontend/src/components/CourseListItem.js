import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AuthContext } from "../context/AuthContext"
import Badge from 'react-bootstrap/Badge'
import { useNavigate } from 'react-router-dom'

const CourseListItem = ({ lesson, index }) => {
    const navigate = useNavigate()
    const { tokens, logout } = React.useContext(AuthContext)

    const [status, setStatus] = useState({
        available: false,
        completed: false,
        on_review: false
    })

    useEffect(() => {
        const getStatus = async () => {
            const config = {
                headers: {
                    'Authorization': `JWT ${tokens.access}`
                }
            }
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/${lesson.id}/get_status`, config)
                .then(res => setStatus({
                    available: res.data.available,
                    completed: res.data.completed,
                    on_review: res.data.on_review
                }))
                .catch(err => err.response.status === 401 ? logout() : console.log(err))

        }
        getStatus()
    }, [lesson.id, tokens.access, logout])

    return (
        <div
            key={`fl_${lesson.id}`}
            className={`w-100 d-flex bg-white flex-row rounded shadow-sm mb-3 border border-3 ${lesson.access !== 'free' && !status.available && 'border-secondary'} ${status.completed && 'border-success'} ${status.on_review && 'border-primary'} `}>
            <div className="col-4">
                <img src={lesson.preview} alt='preview' className="w-100" />
            </div>
            <div className="p-3 w-100 d-flex flex-column justify-content-between">
                {/* {status.completed && <Badge bg='success' style={{ float: 'right' }}>Пройден</Badge>} */}
                {/* {status.on_review && <Badge bg='primary' style={{ float: 'right' }}>На ревью</Badge>} */}
                <div>
                    <h3>{index + 1} {lesson.name}</h3>
                    <p>{lesson.description}</p>
                </div>
                <div className="text-right">
                    {status.available || lesson.access === 'free' ? (
                        <button
                            className='btn btn-primary'
                            style={{ float: 'right' }}
                            onClick={() => navigate(`/lesson/${lesson.id}`)}>
                            Начать
                        </button>) : (
                        <a
                            className='btn btn-primary'
                            style={{ float: 'right' }}
                            href='#card' >
                            Купить
                        </a>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CourseListItem