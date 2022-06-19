import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import autosize from 'autosize';
import { ArrowRight, X } from 'react-bootstrap-icons'
import VoiceRecorder from './voiceRecorder/VoiceRecorder'
// import AudioPlayer from './AudioPlayer'

import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

const Comments = () => {
    const params = useParams()
    const navigate = useNavigate()
    const { tokens, logout, setHeader } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [reloading, setReloading] = useState(false)
    const [comments, setComments] = useState('')

    const [commentText, setCommentText] = useState('')
    const [recording, setRecording] = useState(false)
    const [voice, setVoice] = useState()
    const [reply, setReply] = useState()

    const textareaRef = useRef()
    const audioRef = useRef()

    useEffect(() => { autosize(textareaRef.current) }, [])

    useEffect(() => {
        const fetchComments = async () => {
            const config = {
                headers: {
                    'Authorization': `JWT ${tokens.access}`
                }
            }
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/${params.lessonID}/comments`, config)
                .then(res => {
                    setComments(res.data.comments)
                    setLoading(false)
                })
                .catch(err => console.log(err.response))
        }
        fetchComments()
    }, [params.lessonID, tokens, reloading])

    const sendComment = async () => {
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

            await axios.post(`${process.env.REACT_APP_API_URL}/lesson/${params.lessonID}/comments`, formData, config)
                .then(res => setReloading(!reloading))
                .catch(err => err.response.status === 401 ? logout() : console.log(err.response))
                .finally(() => {
                    setCommentText('')
                    setVoice(null)
                    setReply(null)
                })
        }
    }

    if (loading) return <Spinner animation='border' className="spinner-border-xl f-flex justify-" />

    return (
        <div className="position-relative" style={{ paddingBottom: textareaRef.current && textareaRef.current.style.height }}>
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
                        {/* {comment.voice && <AudioPlayer voice={comment.voice} />} */}
                        <button
                            className="btn btn-link"
                            onClick={() => {
                                setReply(comment)
                                textareaRef.current.focus()
                            }}>
                            Ответить
                        </button>
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

            <div className="p-2 fixed-bottom bg-white" >
                <div className="d-flex flex-row ">
                    {voice ? (
                        <div className='w-100'>
                            <AudioPlayer
                                src={voice.audio}
                                layout="horizontal-reverse"
                                showJumpControls={false}
                                autoPlayAfterSrcChange={false}
                                showDownloadProgress={false}
                                customAdditionalControls={[]}
                                customVolumeControls={[]}
                            />

                        </div>
                    ) : (
                        <div className="w-100">
                            <textarea
                                ref={textareaRef}
                                rows="1"
                                className="form-control"
                                style={{ maxHeight: 150, resizeL: "none" }}
                                name="commentTextArea"
                                id="commentTextArea"
                                disabled={recording}
                                onChange={e => setCommentText(e.target.value)}
                                value={commentText}
                            />
                            <div className="position-absolute bg-white" style={{ top: -15, left: "1rem" }}>
                                <span>{reply ? `${reply.user.first_name} ${reply.user.last_name},` : "Ваш комментарий:"}</span>
                                {reply && <X color="red" size="20" onClick={() => setReply('')} />}
                            </div>
                        </div>
                    )}

                    {commentText || voice ? (
                        <div className="fixed-right d-flex flex-row">
                            {voice && <button className="btn btn-danger mx-1" onClick={() => setVoice(null)}><X size="20" /></button>}
                            <button className="btn btn-primary" onClick={() => sendComment()}><ArrowRight size="20" /></button>
                        </div>
                    ) : (
                        <VoiceRecorder setVoice={setVoice} setRecording={setRecording} />
                    )}
                </div>
            </div>
        </div >
    )
}

export default Comments