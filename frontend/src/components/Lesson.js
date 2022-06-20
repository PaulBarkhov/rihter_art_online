import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import Video from './Video'
import Comments from './Comments'
import VoiceRecorder from './voiceRecorder/VoiceRecorder'

const Lesson = () => {
    const params = useParams()
    const navigate = useNavigate()
    const { tokens, logout, setHeader } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState(0)

    const [lessonData, setLessonData] = useState({
        error: '',
        id: '',
        name: '',
        description: '',
        preview: '',
        photos: '',
        videos: '',
        excersize: '',
        comments: ''
    })

    useEffect(() => {
        const getLessonData = async () => {
            const config = {
                headers: {
                    'Authorization': `JWT ${tokens.access}`
                }
            }
            await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${params.lessonID}`, config)
                .then(res => {
                    setLessonData({
                        error: "",
                        id: res.data.lesson.id,
                        name: res.data.lesson.name,
                        description: res.data.lesson.description,
                        preview: res.data.lesson.preview,
                        photos: res.data.lesson.photos,
                        videos: res.data.videos,
                        excersize: res.data.lesson.excersize,
                        comments: res.data.lesson.comments
                    })
                    // setHeader(res.data.lesson.name)
                    setLoading(false)
                })
                .catch(err => {
                    if (err.response.status === 401) logout()
                    if (err.response.status === 403) setLessonData({ error: 'У вас нет доступа к этому уроку' })
                    else setLessonData({ error: `Ошибка: ${err.response.data}` })
                })
        }
        getLessonData()

    }, [params.lessonID, tokens, logout])


    const renderDangerousHTML = () => {
        return { __html: lessonData.excersize }
    }

    if (loading) return <Spinner animation='border' className="spinner-border-xl f-flex justify-" />

    if (lessonData.error) return <h1>{lessonData.error}</h1>

    return (
        <div>
            <div className="col-sm-3 d-flex flex-row justify-content-evenly mb-4">
                <div className={`w-100 text-center text-primary p-2 ${activeTab === 0 && "border-bottom border-3 border-primary"}`} role="button" onClick={() => setActiveTab(0)}>Урок</div>
                <div className={`w-100 text-center text-primary p-2 ${activeTab === 1 && "border-bottom border-3 border-primary"}`} role="button" onClick={() => setActiveTab(1)}>Задание</div>
                <div className={`w-100 text-center text-primary p-2 ${activeTab === 2 && "border-bottom border-3 border-primary"}`} role="button" onClick={() => setActiveTab(2)}>Обсуждение</div>
            </div>
            {/* <div className=''>
                <div style={{ height: '80vh', position: "relative" }}><iframe src="https://player.vimeo.com/video/675531313?h=fbd0a03228&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} title="2 сердце boys .MOV"></iframe></div>
                <h1>{lessonData.name}</h1>
                <h2>{lessonData.description}</h2>
                <img src={lessonData.preview} alt='preview' />
            </div> */}
            <div className={activeTab === 0 ? "d-block" : "d-none"}>
                <h1>{lessonData.name}</h1>
                <p>{lessonData.description}</p>
                <div className='mb-4'>
                    {lessonData.videos && lessonData.videos.map(video => <Video key={Math.random()} video={video} />)}
                </div>
                <div className="d-flex flex-column flex-md-row pb-4">
                    {lessonData.photos && lessonData.photos.map(photo => <div key={photo.id} className="col-md-4 mb-2 text-center">
                        <h1>{photo.name}</h1>
                        <img key={photo.id} src={photo.url} alt={photo.name} width="100%" style={{ border: "1px solid grey", borderRadius: 5 }} />
                    </div>)}
                </div>
            </div>




            <div className={activeTab === 1 ? "d-block" : "d-none"}>
                <div dangerouslySetInnerHTML={renderDangerousHTML()}></div>
                <VoiceRecorder tokens={tokens} lessonID={params.lessonID} />
            </div>




            <div className={activeTab === 2 ? "d-block" : "d-none"} style={{ paddingBottom: 50 }}>
                <Comments />
            </div>








        </div>



    )
}

export default Lesson
