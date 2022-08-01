import React, { useState, useLayoutEffect, useRef, useContext } from "react"
import Card from 'react-bootstrap/Card'
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import CourseListItem from './CourseListItem'
import Spinner from 'react-bootstrap/Spinner'
import OffsetSpinner from "./OffsetSpinner"
import UnavailableLessonPack from "./UnavailableLessonPack"

const initialState = {
    id: 0,
    name: '',
    description: '',
    preview: '',
    lessons: [],
    purchased_lessonPacks: [],
    unavailable_lessonPacks: [],
    currency: ''
}

const Course = () => {
    const { fetchCourseData, getPaymentLink, cart, en, setShowCartModal, addCartItems } = useContext(AuthContext)

    const [course, setCourse] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [selectedLessonPacks, setSelectedLessonPacks] = useState([])

    const [offset, setOffset] = useState(100) //animation

    const params = useParams()
    const cardRef = useRef()

    useLayoutEffect(() => {
        fetchCourseData(params.courseID)
            .then(res => {
                setCourse({
                    id: res.data.course.id,
                    name: res.data.course.name,
                    description: res.data.course.description,
                    preview: res.data.course.preview,
                    currency: res.data.course.currency,
                    lessons: res.data.course.lessons,
                    purchased_lessonPacks: res.data.purchased_lessonPacks,
                    unavailable_lessonPacks: res.data.unavailable_lessonPacks,
                })
                setSelectedLessonPacks([res.data.unavailable_lessonPacks[0]])
            })
            .finally(() => setOffset(0))
    }, [params.courseID, fetchCourseData])

    useLayoutEffect(() => {
        cart.length !== 0 &&
            setSelectedLessonPacks(course.unavailable_lessonPacks.filter(pack =>
                cart.some(cartItem =>
                    pack.id === cartItem.ref.id
                )))
    }, [course, cart])

    const selectLessonPack = (checked, index) => {
        if (index === 0 || checked) setSelectedLessonPacks(course.unavailable_lessonPacks.slice(0, index + 1))
        else setSelectedLessonPacks(course.unavailable_lessonPacks.slice(0, index))
    }

    const addToCart = () => {
        addCartItems(selectedLessonPacks)
        // setCart(prev => {
        //     prev = [...prev, ...selectedLessonPacks]
        //     return [...new Map(prev.map(pack => [pack.id, pack])).values()] //deletes duplicates by id
        // })
    }

    const handleBuy = () => {
        setLoading(true)

        getPaymentLink({
            lessonPacks: selectedLessonPacks.map(lessonPack => (({ id, name, price, course_name }) => ({ id, name, price, course_name }))(lessonPack)),
            currency: course.currency
        })
            .then(res => {
                window.open(res.data)
                // w.location = res.data
            })
            .finally(() => setLoading(false))
    }

    return (
        <div
            style={{ transform: `translateX(${offset}%)`, transition: 'transform 0.2s ease' }}
            className='
                d-flex 
                flex-column-reverse 
                flex-lg-row 
                justify-content-around
                position-relative
            '>

            {offset === 100 && <OffsetSpinner />}

            <div className='col-lg-6 col-xl-7'>
                {/* <h1>{lessons.course_name}</h1>
                    <h5>{lessons.course_description}</h5> */}
                <div className='f-flex flex-column'>
                    {course.lessons.map((lesson, index) =>
                        <CourseListItem
                            key={lesson.id}
                            index={index}
                            lesson={lesson}
                            cardRef={cardRef} />)
                    }
                </div>
            </div>

            <div id="card" className="col-lg-5 col-xl-4 position-relative">
                <div className="sticky-top overflow-auto" style={{ top: 74, maxHeight: 'calc(100vh - 74px)' }}>
                    <div className="mb-4">
                        <Card className='border rounded shadow-sm' >
                            <div className='fade-bottom' style={{
                                width: '100%',
                                height: 300,
                                backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1)),
                                url(${course.preview})`
                            }}></div>
                            {/* <Card.Img className='fade-bottom' src={course.preview} style={{ minHeight: 300 }} /> */}
                            <Card.Body ref={cardRef}>
                                <Card.Title>{course.name}</Card.Title>
                                <Card.Text>{course.description}</Card.Text>
                                <form>
                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input mr-1"
                                                style={{ backgroundColor: 'green' }}
                                                type="checkbox"
                                                checked
                                                disabled
                                                name="freeLessonPack"
                                                id="freeLessonsCheckbox" />
                                            <label
                                                className="form-check-label"
                                                htmlFor="freeLessonsCheckbox">
                                                {en ? 'Lessons 1-' : 'Уроки 1-'}
                                                {course.lessons.filter(lesson => lesson.access === 'free').length}
                                                {en ? ' free' : ' бесплатно'}
                                            </label>
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
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={pack.id}>
                                                        {en ? 'Lessons ' : 'Уроки '}
                                                        {pack.name}
                                                        {en ? ' purchased' : ' уже куплены'}
                                                    </label>
                                                </div>
                                            )
                                        })}

                                        {course.unavailable_lessonPacks.map((pack, index) =>
                                            <UnavailableLessonPack
                                                key={pack.id}
                                                pack={pack}
                                                index={index}
                                                selectedLessonPacks={selectedLessonPacks}
                                                selectLessonPack={selectLessonPack} />
                                        )}

                                        <h2 className="mt-3">
                                            {selectedLessonPacks &&
                                                selectedLessonPacks.reduce((sum, selectedLessonPack) =>
                                                    sum + parseFloat(selectedLessonPack.price), 0).toFixed(2) + ' '
                                            }
                                            {en ? course.currency : (course.currency === 'RUB' ? 'рублей' : course.currency)}
                                        </h2>
                                    </div>

                                </form>

                                <div className="d-flex flex-column justify-content-center">
                                    <button
                                        className="btn btn-primary w-100 mb-1"
                                        disabled={selectedLessonPacks.length === 0}
                                        onClick={handleBuy}>
                                        {loading && <Spinner animation="border" size="sm" />}
                                        {en ? ' Purchase' : ' Купить'}
                                    </button>
                                    {
                                        selectedLessonPacks && selectedLessonPacks.filter(pack =>
                                            cart.some(cartItem => cartItem.ref.id === pack.id)
                                        ).length === selectedLessonPacks.length ?
                                            <button
                                                className="btn btn-warning w-100"
                                                disabled={selectedLessonPacks.length === 0}
                                                onClick={() => setShowCartModal(true)}>
                                                {en ? 'Open cart' : 'Открыть корзину'}
                                            </button>
                                            :
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                disabled={selectedLessonPacks.length === 0}
                                                onClick={addToCart}>
                                                {en ? 'Add to cart' : 'Добавить в корзину'}
                                            </button>
                                    }
                                </div>
                            </Card.Body>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course
