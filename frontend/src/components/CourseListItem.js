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
            className={`w-100
                d-flex 
                bg-white 
                flex-lg-row
                rounded 
                shadow-sm 
                mb-3 
                border 
                shadow-sm 
                ${lesson.access !== 'free' && !status.available && 'border-secondary'} 
                ${status.completed && 'border-success'} 
                ${status.on_review && 'border-primary'} `
            }>
            {/* <div className="col-5 col-xl-4">
                <img
                    align='left'
                    src={lesson.preview}
                    alt='preview'
                    className="col-5 col-xl-4 w-100"
                />
            </div> */}
            <div className="w-100 d-flex flex-column justify-content-between">
                {/* {status.completed && <Badge bg='success' style={{ float: 'right' }}>Пройден</Badge>} */}
                {/* {status.on_review && <Badge bg='primary' style={{ float: 'right' }}>На ревью</Badge>} */}
                <div className=''>
                    <img
                        style={{ float: 'left', marginRight: 14 }}
                        src={lesson.preview}
                        alt='preview'
                        className="col-5 col-xl-4 pr-2"
                    />
                    <div className="p-3 pb-4 mb-3 position-relative h-100">
                        <h4>{index + 1} {lesson.name}</h4>
                        <p className='d-xs-block d-sm-none'>{lesson.description.substring(0, 300)}{lesson.description.length > 140 && '...'}</p>
                        <p className='d-none d-sm-block d-md-none'>{lesson.description.substring(0, 140)}{lesson.description.length > 140 && '...'}</p>
                        <p className='d-none d-md-block d-lg-none'>{lesson.description.substring(0, 330)}{lesson.description.length > 330 && '...'}</p>
                        <p className='d-none d-lg-block d-xl-none'>{lesson.description.substring(0, 70)}{lesson.description.length > 70 && '...'}</p>
                        <p className='d-none d-xl-block'>{lesson.description.substring(0, 140)}{lesson.description.length > 140 && '...'}</p>
                        <div style={{ position: 'absolute', right: 10, bottom: 10 }}>
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
            </div>
        </div>
    )
}

export default CourseListItem