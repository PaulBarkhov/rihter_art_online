import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'

import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import ChatInput from './ChatInput'

const Comments = () => {
    const params = useParams()
    const { tokens, logout, user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [reloading, setReloading] = useState(false)
    const [comments, setComments] = useState('')
    const [reply, setReply] = useState()

    useEffect(() => {
        const fetchComments = async () => {
            const config = {
                headers: {
                    'Authorization': `JWT ${tokens.access}`
                }
            }
            await axios.get(`${process.env.REACT_APP_API_URL}/api/lesson/${params.lessonID}/comments`, config)
                .then(res => {
                    setComments(res.data.comments)
                    setLoading(false)
                })
                .catch(err => console.log(err.response))
        }
        fetchComments()
    }, [params.lessonID, tokens, reloading])

    const sendComment = async (commentText, voice) => {
        if (commentText || voice) {
            const config = {
                headers: {
                    'Authorization': `JWT ${tokens.access}`,
                    "Content-Type": "multipart/form-data"
                }
            }
            const formData = new FormData()
            formData.append("text", commentText || '')
            formData.append("voice", voice ? voice.blob : '')
            formData.append("parentID", reply ? reply.id : '')

            await axios.post(`${process.env.REACT_APP_API_URL}/api/lesson/${params.lessonID}/comments`, formData, config)
                .then(res => setReloading(!reloading))
                .catch(err => err.response.status === 401 ? logout() : console.log(err.response))
        }
    }

    const deleteComment = async (id) => {
        const config = {
            headers: {
                'Authorization': `JWT ${tokens.access}`,
                "Content-Type": "multipart/form-data"
            }
        }

        await axios.delete(`${process.env.REACT_APP_API_URL}/api/comment/${id}`, config)
            .then(res => {
                console.log(res)
                setReloading(!reloading)
            })
            .catch(err => err.response.status === 401 ? logout() : console.log(err.response))
    }


    if (loading) return <Spinner animation='border' className="spinner-border-xl f-flex justify-" />

    return (
        <div className="position-relative" style={{ paddingBottom: 70 }}>
            {comments.length === 0 ? <h1>Пока нет комментариев</h1> : comments.map(comment => {
                return (
                    <div key={comment.id} className="border rounded p-3 my-3">
                        <div className="d-flex flex-row align-items-center mb-3">
                            <img src={comment.user.profile.thumbnail} alt="profile_image" width="70" height="70" style={{ borderRadius: 100, marginRight: 20, objectFit: 'cover' }} />
                            <div>
                                <h1>{comment.user.first_name} {comment.user.last_name}</h1>
                                <p>{comment.date}</p>
                            </div>
                        </div>
                        <p>{comment.text}</p>
                        {comment.voice && <AudioPlayer
                            src={comment.voice}
                            layout="horizontal-reverse"
                            showJumpControls={false}
                            autoPlayAfterSrcChange={false}
                            showDownloadProgress={false}
                            customAdditionalControls={[]}
                            customVolumeControls={[]}
                        />
                        }
                        {
                            comment.user.id === user.user_id ? (
                                <button
                                    className="btn btn-link"
                                    style={{ color: 'red' }}
                                    onClick={() => deleteComment(comment.id)}>
                                    Удалить комментарий
                                </button>

                            ) : (
                                <button
                                    className="btn btn-link"
                                    onClick={() => setReply(comment)}>
                                    Ответить
                                </button>
                            )
                        }

                        <div style={{ borderLeft: "1px solid grey" }}>
                            {comment.children.map(child => <div key={child.id} className="p-2">
                                <div className="d-flex flex-row">
                                    <img src={child.user.profile.thumbnail} alt="profile_image" width="50" height="50" style={{ borderRadius: 100, marginLeft: 6, marginRight: 15, marginTop: 5, objectFit: 'cover' }} />
                                    <div>
                                        <h5>{child.user.first_name} {child.user.last_name}</h5>
                                        <span>{child.date}</span>
                                    </div>
                                </div>
                                <div className="mt-3 mx-2">
                                    <p>{child.text}</p>
                                    {child.voice && <AudioPlayer
                                        src={child.voice}
                                        layout="horizontal-reverse"
                                        showJumpControls={false}
                                        autoPlayAfterSrcChange={false}
                                        showDownloadProgress={false}
                                        customAdditionalControls={[]}
                                        customVolumeControls={[]}
                                    />}
                                </div>
                            </div>)}
                        </div>
                    </div>
                )
            })}
            <ChatInput send={sendComment} reply={reply} setReply={setReply} />
        </div >
    )
}

export default Comments