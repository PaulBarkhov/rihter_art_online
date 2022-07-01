import React, { useState, useContext, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import Comments from './Comments'
import Excersize from './Excersize'
import { MemorizedLessonMaterials } from './LessonMaterials'

const Lesson = () => {
    const [lessonData, setLessonData] = useState()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState(0)

    const params = useParams()

    const { fetchLessonData, logout } = useContext(AuthContext)

    useLayoutEffect(() => {
        fetchLessonData(params.lessonID)
            .then(res => setLessonData(res.data.lesson))
            .catch(err => {
                if (err.response.status === 401) logout()
                if (err.response.status === 403) setError('У вас нет доступа к этому уроку')
                else setError(`Ошибка: ${err.response.data}`)
            })
            .finally(() => setLoading(false))

    }, [params.lessonID, fetchLessonData, logout])

    if (error) return <h1>{error}</h1>

    if (loading) return <div className='w-100 text-center pt-4'><Spinner animation='border' className="spinner-border-xl f-flex justify-" /></div>

    return (
        <>
            <div className="col-sm-3 d-flex flex-row justify-content-evenly mb-4">
                <div className={`w-100 text-center text-primary p-2 ${activeTab === 0 && "border-bottom border-3 border-primary"}`} role="button" onClick={() => setActiveTab(0)}>Урок</div>
                <div className={`w-100 text-center text-primary p-2 ${activeTab === 1 && "border-bottom border-3 border-primary"}`} role="button" onClick={() => setActiveTab(1)}>Задание</div>
                <div className={`w-100 text-center text-primary p-2 ${activeTab === 2 && "border-bottom border-3 border-primary"}`} role="button" onClick={() => setActiveTab(2)}>Обсуждение</div>
            </div>

            <h1 className='text-center'>{lessonData.name}</h1>

            <div className={activeTab === 0 ? "d-block" : "d-none"}>
                <p className='border rounded p-2 shadow-sm'>{lessonData.description}</p>
                <MemorizedLessonMaterials lessonData={lessonData} />
            </div>

            <div className={activeTab === 1 ? "d-block" : "d-none"}>
                <Excersize lessonID={params.lessonID} />
            </div>

            <div className={activeTab === 2 ? "d-block" : "d-none"} style={{ paddingBottom: 50 }}>
                <Comments />
            </div>

        </>
    )
}

export default Lesson
