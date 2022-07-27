import React, { useContext, useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import OffsetSpinner from '../components/OffsetSpinner'

function HomePage() {
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()
    const [offset, setOffset] = useState(100) //animation

    const { fetchCourses, en } = useContext(AuthContext)

    useLayoutEffect(() => {
        fetchCourses()
            .then(res => {
                setCourses(res.data.courses)
            })
            .finally(() => setOffset(0))
    }, [fetchCourses])

    return (
        <div
            style={{ transform: `translateX(${offset}%)`, transition: 'transform 0.2s ease' }}
            className='d-flex flex-row flex-wrap'>

            {offset === 100 && <OffsetSpinner />}

            {courses && courses.map(course => {
                return (
                    <div key={course.id} className="col-12 col-lg-3">
                        <div
                            className='mb-4 m-lg-1 border rounded shadow-sm'
                            key={course.id}
                            onClick={() => navigate(`/course/${course.id}`)}>
                            <img className='card-img-top' src={course.preview} alt='Preview' />
                            <div className='card-body'>
                                <h5 className="card-title">{course.name}</h5>
                                <p className="card-text">
                                    {course.min_price &&
                                        <>
                                            {en ? 'from' : 'от'} {course.min_price} {en ? course.currency : (course.currency === 'RUB' ? 'рублей' : course.currency)}
                                        </>
                                    }
                                </p>
                                {/* <p className="card-text">{course.description}</p> */}
                                {/* <Text style={styles.price}>От {course.price} рублей</Text>
                                <Text style={styles.price}>
                                {String(course.number_of_available_lessons)} из {String(course.total_number_of_lessons).slice(-1)} {ending} доступны
                                </Text> */}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default HomePage
