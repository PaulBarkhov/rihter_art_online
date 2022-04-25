import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { TouchableOpacity, View, Text, Image } from '../components/react-native'
import GlobalStyles from '../GlobalStyles'

import { AuthContext } from '../context/AuthContext'

function HomePage() {
    const { tokens, logout } = useContext(AuthContext)
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            if (tokens) {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${tokens.access}`
                    }
                }
                await axios.get(`${process.env.REACT_APP_API_URL}/all_courses`, config)
                    // .then(res => res.json())
                    .then(res => {
                        setCourses(res.data.courses)
                    })
                    .catch(err => err.response.status === 401 ? logout() : console.log(err))
            } else logout()

        }
        fetchData()
    }, [tokens, logout])

    return (
        <div className='d-flex flex-row flex-wrap'>
            {courses && courses.map(course => {
                return (
                    <div key={course.id} className="col-12 col-lg-3">
                        <div
                            className='mb-4 m-lg-1 border rounded'
                            // style={{ minWidth: '18rem', width: '18rem' }}
                            key={course.id}
                            onClick={() => navigate(`/course/${course.id}`, { replace: true })}>
                            <img className='card-img-top' src={course.preview} alt='Preview' />
                            <div className='card-body'>
                                <h5 className="card-title">{course.name}</h5>
                                <p className="card-text">от {course.min_price} рублей</p>
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

const styles = {
    item: {
        minWidth: 300,
        minHeight: 200,
        margin: 10,
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'wheat',
        // borderRadius: 10,
        overflow: 'hidden',
        // borderColor: '#b5b5b5',
        // borderWidth: 1
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'sans-serif'
    },
    description: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'sans-serif'
    },
    image: {
        height: 150,
        borderRadius: 10,
    },
    textBlock: {
        flex: 6,
        flexDirection: 'column',
        margin: 10,
        flexShrink: 1
    },

}