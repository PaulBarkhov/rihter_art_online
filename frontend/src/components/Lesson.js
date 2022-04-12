import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'

const Lesson = () => {
    const params = useParams()
    const navigate = useNavigate()
    const { tokens, logout } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    const [lessonData, setLessonData] = useState({
        error: '',
        id: '',
        name: '',
        description: '',
        preview: '',
        video: '',
        excersize: '',
    })

    useEffect(() => {
        const getLessonData = async () => {
            const config = {
                headers: {
                    'Authorization': `Bearer ${tokens.access}`
                }
            }
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/${params.lessonID}`, config)
                .then(res => setLessonData(res.data))
                .catch(err => err.response.status === 403 && setLessonData({ error: 'У вас нет доступа к этому уроку' }))
                .finally(setLoading(false))
        }
        getLessonData()

    }, [params.lessonID, tokens.access])


    if (loading) return <Spinner animation='border' className="spinner-border-xl f-flex justify-" />

    if (lessonData.error) return <h1>{lessonData.error}</h1>

    return (
        <div>
            <h1>{lessonData.name}</h1>
            <h2>{lessonData.description}</h2>
            <img src={lessonData.preview} alt='preview' />
        </div>
    )
}

export default Lesson