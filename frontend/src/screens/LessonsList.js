import React, { useState, useEffect } from "react"
import axios from "axios"
import { Text, View, TouchableOpacity, Image } from "../components/react-native"
import GlobalStyles from "../GlobalStyles"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"


const LessonsList = () => {
  const { tokens, logout } = React.useContext(AuthContext)
  const [lessons, setLessons] = useState({
    free_lessons: [],
    purchased_lessonPacks: [],
    unavailable_lessonPacks: []
  })
  const [loading, setLoading] = useState(false)
  const [refresher, setRefresher] = useState(false)
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    if (tokens) {
      const config = {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      }
      const fetchLessons = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/course/${params.courseID}`, config)
          .then(res => setLessons({
            free_lessons: res.data.free_lessons,
            purchased_lessonPacks: res.data.purchased_lessonPacks,
            unavailable_lessonPacks: res.data.unavailable_lessonPacks
          }))
          .catch(err => err.response.status === 401 ? logout() : console.log(err))
      }
      fetchLessons()
    } else logout()

  }, [params.courseID, tokens, logout])
  const refresh = () => setRefresher(!refresher)

  if (loading) return (<View><Text>Loading</Text></View>)
  return (
    <View style={GlobalStyles.container}>
      <View style={styles.course}>
        <Text style={styles.courseHeader}>Курс</Text>
        <Text>Name</Text>
        <Text>Description</Text>
        {lessons.free_lessons.map(lesson => {
          return (
            <TouchableOpacity key={`fl_${lesson.id}`} style={styles.touchable} onPress={() => navigate()}>
              <View style={styles.item}>
                <Image source={lesson.preview} style={styles.image} />
                <Text style={styles.title}>{lesson.name}</Text>
              </View>
            </TouchableOpacity>
          )
        })}

        {lessons.purchased_lessonPacks.map(lessonPack => {
          return lessonPack.lessons.map(lesson => {
            return (
              <TouchableOpacity key={`pl_${lesson.id}`} style={styles.touchable} onPress={() => navigate()}>
                <View style={styles.item}>
                  <Text style={styles.title}>{lesson.name}</Text>
                </View>
              </TouchableOpacity>
            )
          })
        })}


        {lessons.unavailable_lessonPacks.map(lessonPack => {
          return (
            <View key={`ulp_${lessonPack.id}`} style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', filter: 'blur(8px)' }}>
              {lessonPack.lessons && lessonPack.lessons.map(lesson => {
                return (
                  <TouchableOpacity key={`ul_${lesson.id}`} style={styles.touchable} onPress={() => navigate()}>
                    <View style={styles.item}>
                      <Text style={styles.title}>{lesson.name}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: -2,
                  right: 0,
                  bottom: 2,
                  borderColor: '#cfcfcf',
                  borderWidth: 2,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7, borderColor: 'grey', borderWidth: 1 }}
                  onPress={() => {
                    fetch('http://192.168.2.114:8000/buy_lessonPack',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'applications/json'
                        },
                        body: JSON.stringify({ lessonPack: lessonPack.id })
                      }
                    )
                      .then(refresh)
                  }}
                >
                  <Text style={{ color: 'grey', fontSize: 18, fontWeight: '800' }}>
                    Купить за {lessonPack.price} рублей
                  </Text>
                </TouchableOpacity>

              </View>
            </View>

          )
        })}
      </View>
    </View>
  )
}

export default LessonsList

const styles = {
  course: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    minHeight: '100vh',
  },
  courseHeader: {
    fontSize: 30,
    margin: 10
  },
  touchable: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 5
  },
  item: {
    marginBottom: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'tomato',
    borderRadius: 6
  },
  image: {
    height: 150,
  },
  title: {
    fontSize: 20,
    padding: 10,
    color: 'white',
    fontWeight: '600'
  },

}
