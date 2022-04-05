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
                        setCourses(res.data)
                    })
                    .catch(err => err.response.status === 401 ? logout() : console.log(err))
            } else logout()

        }
        fetchData()
    }, [tokens, logout])

    return (
        <View style={GlobalStyles.container}>
            <View style={{ backgroundColor: 'white' }}>
                {courses && courses.map(course => {
                    return (
                        <TouchableOpacity
                            key={course.id}
                            onPress={() => navigate(`/${course.id}`, { replace: true })}>
                            <View style={styles.item}>
                                <Image source={course.preview} style={styles.image} />
                                <View style={styles.textBlock}>
                                    <Text style={styles.title}>{course.name}</Text>
                                    {/* <Text style={styles.price}>От {course.price} рублей</Text>
                                <Text style={styles.price}>
                                    {String(course.number_of_available_lessons)} из {String(course.total_number_of_lessons).slice(-1)} {ending} доступны
                                </Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
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