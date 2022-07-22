import React, { useLayoutEffect, useContext, useState } from 'react'
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from 'react-router-dom'

const CourseListItem = ({ lesson, index, cardRef }) => {
    const navigate = useNavigate()

    const [status, setStatus] = useState({
        available: false,
        completed: false,
        on_review: false
    })

    const { fetchLessonStatus, en } = useContext(AuthContext)

    useLayoutEffect(() => {
        fetchLessonStatus(lesson.id)
            .then(res => setStatus({
                available: res.data.available,
                completed: res.data.completed,
                on_review: res.data.on_review
            }))
    }, [lesson.id, fetchLessonStatus])

    return (
        <div
            key={`fl_${lesson.id}`}
            className={`w-100 d-flex bg-white flex-row rounded shadow-sm mb-3 border shadow-sm ${lesson.access !== 'free' && !status.available && 'border-secondary'} ${status.completed && 'border-success'} ${status.on_review && 'border-primary'} `}>
            <div className="col-4">
                <img
                    src={lesson.preview}
                    alt='preview'
                    className="w-100"
                // style={{ width: '100%' }}
                />
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
                            {en ? 'Open' : 'Открыть'}
                        </button>) : (
                        <button
                            className='btn btn-outline-primary'
                            style={{ float: 'right' }}
                            onClick={() => cardRef.current.scrollIntoView(false)}>
                            {en ? 'Purchase' : 'Купить'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CourseListItem