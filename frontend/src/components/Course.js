import React, { useState, useEffect } from "react"
import axios from "axios"
import Card from 'react-bootstrap/Card'
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import CourseListItem from './CourseListItem'

const Course = () => {
    const { tokens, logout } = React.useContext(AuthContext)
    const [course, setCourse] = useState({
        id: 0,
        name: '',
        description: '',
        preview: '',
        lessons: []
    })
    const [loading, setLoading] = useState(true)
    const [refresher, setRefresher] = useState(false)
    const params = useParams()

    useEffect(() => {
        if (tokens) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${tokens.access}`
                }
            }
            const fetchCourseData = async () => {
                await axios.get(`${process.env.REACT_APP_API_URL}/course/${params.courseID}`, config)
                    .then(res => setCourse({
                        id: res.data.id,
                        name: res.data.name,
                        description: res.data.description,
                        preview: res.data.preview,
                        lessons: res.data.lessons
                    }))
                    .catch(err => err.response.status === 401 ? logout() : console.log(err))
                    .finally(setLoading(false))
            }
            fetchCourseData()
        } else logout()

    }, [params.courseID, tokens, logout])
    const refresh = () => setRefresher(!refresher)

    if (loading) return (<h1>Loading...</h1>)
    return (
        <div className='d-flex flex-column-reverse flex-lg-row position-relative'>

            <div className='col-lg-7'>
                {/* <h1>{lessons.course_name}</h1>
                    <h5>{lessons.course_description}</h5> */}
                <div className='f-flex flex-column'>
                    {course.lessons.map(lesson => <CourseListItem key={lesson.id} lesson={lesson} />)}
                </div>
            </div>

            <div className="col-lg-1"></div>

            <div id="card" className="col-lg-4">
                <Card className='border border-3 rounded mb-4'>
                    <Card.Img src={course.preview} />
                    <Card.Body>
                        <Card.Title>{course.name}</Card.Title>
                        <Card.Text>{course.description}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Course
