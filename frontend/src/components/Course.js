import React, { useState, useLayoutEffect, useRef, useContext } from "react"
import Card from 'react-bootstrap/Card'
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import CourseListItem from './CourseListItem'

const initialState = {
    id: 0,
    name: '',
    description: '',
    preview: '',
    lessons: [],
    purchased_lessonPacks: [],
    unavailable_lessonPacks: []
}

const Course = () => {
    const [course, setCourse] = useState(initialState)
    const [loading, setLoading] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState([])

    const params = useParams()
    const cardRef = useRef()

    const { fetchCourseData } = useContext(AuthContext)

    useLayoutEffect(() => {
        fetchCourseData(params.courseID)
            .then(res => {
                setCourse({
                    id: res.data.course.id,
                    name: res.data.course.name,
                    description: res.data.course.description,
                    preview: res.data.course.preview,
                    lessons: res.data.course.lessons,
                    purchased_lessonPacks: res.data.purchased_lessonPacks,
                    unavailable_lessonPacks: res.data.unavailable_lessonPacks
                })
                setSelectedOptions([res.data.unavailable_lessonPacks[0]])
            })
            .finally(setLoading(false))

    }, [params.courseID, fetchCourseData])


    if (loading) return (<h1>Loading...</h1>)
    return (
        <div className='d-flex flex-column-reverse flex-lg-row position-relative'>

            <div className='col-lg-7'>
                {/* <h1>{lessons.course_name}</h1>
                    <h5>{lessons.course_description}</h5> */}
                <div className='f-flex flex-column'>
                    {course.lessons.map((lesson, index) => <CourseListItem key={lesson.id} index={index} lesson={lesson} cardRef={cardRef} />)}
                </div>
            </div>

            <div className="col-lg-1"></div>

            <div ref={cardRef} id="card" className="col-lg-4">
                <Card className='border rounded shadow-sm mb-4' >
                    <Card.Img src={course.preview} style={{ minHeight: 300 }} />
                    <Card.Body>
                        <Card.Title>{course.name}</Card.Title>
                        <Card.Text>{course.description}</Card.Text>
                        <form>
                            <div className="mb-4">
                                <div className="form-check">
                                    <input className="form-check-input mr-1" style={{ backgroundColor: 'green' }} type="checkbox" checked disabled name="freeLessonPack" id="freeLessonsCheckbox"></input>
                                    <label className="form-check-label" htmlFor="freeLessonsCheckbox">Уроки 1-{course.lessons.filter(lesson => lesson.access === 'free').length + 1} бесплатно</label>
                                </div>
                                {course.purchased_lessonPacks.map(pack => {
                                    return (
                                        <div key={pack.id} className="form-check">
                                            <input
                                                className="form-check-input mr-1"
                                                style={{ backgroundColor: 'green' }}
                                                type="checkbox"
                                                name="lessonPack"
                                                checked
                                                disabled
                                                id={pack.id}
                                            ></input>
                                            <label className="form-check-label" htmlFor={pack.id}>Уроки {pack.name} уже куплены</label>
                                        </div>
                                    )
                                })}
                                {course.unavailable_lessonPacks.map((pack, index) => {
                                    return (
                                        <div key={pack.id} className="form-check">
                                            <input
                                                className="form-check-input mr-1"
                                                type="checkbox"
                                                name="lessonPack"
                                                checked={!!selectedOptions[index]}
                                                id={pack.id}
                                                onChange={e => {
                                                    if (index === 0) e.target.checked = true
                                                    else {
                                                        if (e.target.checked) setSelectedOptions(course.unavailable_lessonPacks.slice(0, index + 1))
                                                        else setSelectedOptions(course.unavailable_lessonPacks.slice(0, index))
                                                    }
                                                }}
                                            ></input>
                                            <label className="form-check-label" htmlFor={pack.id}>Уроки {pack.name} за {pack.price} рублей</label>
                                        </div>
                                    )
                                })}
                                <h2 className="mt-3">{selectedOptions && selectedOptions.reduce((sum, option) => { return sum + parseFloat(option.price) }, 0).toFixed(2)} рублей</h2>
                            </div>

                        </form>

                        <div className="d-flex flex-column justify-content-center">
                            {/* <Card.Text>{selectedOptions && selectedOptions.reduce((sum, option) => { return sum + parseFloat(option.price) }, 0)}</Card.Text> */}
                            <button className="btn btn-primary w-100 mb-1" disabled={selectedOptions.length === 0}>Купить</button>
                            <button className="btn btn-outline-primary w-100" disabled={selectedOptions.length === 0}>В корзину</button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Course
