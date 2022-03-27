import React, { useState, useEffect } from "react"
import { Text, View, TouchableOpacity, Image } from "../components/react-native"
import GlobalStyles from "../GlobalStyles"
import { useNavigate, useParams } from "react-router-dom"


const LessonsList = () => {
  const [lessons, setLessons] = useState()
  const [refresher, setRefresher] = useState(false)
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/get_lessons/${params.courseID}`)
      .then(res => res.json())
      .then(data => setLessons(data))
  }, [refresher, params.courseID])
  const refresh = () => setRefresher(!refresher)


  if (!lessons) return (<View><Text>Loading</Text></View>)
  else return (
    <View >
      <View style={styles.course}>
        <Text style={styles.courseHeader}>Курс</Text>
        <Text>Name</Text>
        <Text>Description</Text>
        {lessons.free_lessons.map(lesson => {
          return (
            <TouchableOpacity key={lesson.id} style={styles.touchable} onPress={() => navigate()}>
              <View style={styles.item}>
                <Text style={styles.title}>{lesson.name}</Text>
              </View>
            </TouchableOpacity>
          )
        })}

        {lessons.purchased_lessons.map(lesson => {
          return (
            <TouchableOpacity key={lesson.id} style={styles.touchable} onPress={() => navigate()}>
              <View style={styles.item}>
                <Text style={styles.title}>{lesson.name}</Text>
              </View>
            </TouchableOpacity>
          )
        })}





        {lessons.unavailable_lessonPacks.map(lessonPack => {
          return (
            <View key={lessonPack.id} style={{ width: '100%', position: 'relative' }}>
              {lessonPack.videos.map(lesson => {
                return (
                  <TouchableOpacity key={lesson.id} style={styles.touchable} onPress={() => navigate()}>
                    <View style={[styles.item]}>
                      {/* <View style={[styles.item, { backgroundColor: '#cfcfcf' }]}> */}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  courseHeader: {
    fontSize: 30,
    margin: 10
  },
  touchable: {
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
  title: {
    fontSize: 20,
    padding: 10,
    color: 'white',
    fontWeight: '600'
  },

}
