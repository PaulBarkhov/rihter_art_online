import React from 'react'
import { useNavigate, Link, Outlet } from 'react-router-dom'
import { connect } from 'react-redux'

import { TouchableOpacity, View, Text, Image } from '../components/react-native'

import { logout } from '../actions/auth'
import setCSRFToken from '../utils/setCSRFCookie'

function HomePage({ logout, isAuthenticated }) {
    const [courses, setCourses] = React.useState([])
    const navigate = useNavigate()
    if (!isAuthenticated) navigate('/login')

    React.useEffect(() => {
        console.log(isAuthenticated)
        const fetchData = async () => {
            // setCSRFToken()
            await fetch(`${process.env.REACT_APP_API_URL}/all_courses`)
                .then(res => res.json())
                .then(data => setCourses(data))
        }
        fetchData()

    }, [isAuthenticated])

    return (
        <View>
            <h1>{isAuthenticated}</h1>
            <View>
                {courses && courses.map(course => {
                    return (
                        <TouchableOpacity
                            key={course.id}
                            onPress={() => {
                                navigate(`/${course.id}`)
                            }}>
                            <View style={styles.item}>
                                <Image source={course.preview} style={styles.image} />
                                <View style={styles.textBlock}>
                                    <Text style={styles.title}><Link to={`/${course.id}`}>{course.name}</Link></Text>
                                    <Text style={styles.price}>От {course.price} рублей</Text>
                                    {/* <Text style={styles.price}>
                                        {String(course.number_of_available_lessons)} из {String(course.total_number_of_lessons).slice(-1)} {ending} доступны
                                    </Text> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>

            <Outlet />
            <button onClick={logout}>Loguot</button>
        </View>


    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { logout })(HomePage)

const styles = {
    item: {
        minWidth: 300,
        minHeight: 200,
        margin: 10,
        flexDirection: 'row',
        backgroundColor: 'wheat',
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: '#b5b5b5',
        borderWidth: 1
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
        height: 200,
        borderRadius: 10,
    },
    textBlock: {
        flex: 6,
        flexDirection: 'column',
        margin: 10,
        flexShrink: 1
    },

}