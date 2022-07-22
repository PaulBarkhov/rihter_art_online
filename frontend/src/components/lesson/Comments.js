import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import ChatInput from './ChatInput'
import Message from './Message'

const Comments = () => {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [reloading, setReloading] = useState(false)
    const [comments, setComments] = useState('')
    const [reply, setReply] = useState()

    const { fetchComments, postComment: apiPostComment, deleteComment: apiDeleteComment } = useContext(AuthContext)

    useEffect(() => {
        fetchComments(params.lessonID)
            .then(res => setComments(res.data.comments))
            .finally(() => setLoading(false))
    }, [params.lessonID, reloading, fetchComments])

    const postComment = async (commentText, voice) => {
        if (commentText || voice) {
            const formData = new FormData()
            formData.append("text", commentText || '')
            formData.append("voice", voice ? voice.blob : '')
            formData.append("parentID", reply ? reply.id : '')

            apiPostComment(params.lessonID, formData)
                .then(res => setReloading(!reloading))
        }
    }

    const deleteComment = async (commentID) => {
        apiDeleteComment(commentID)
            .then(res => setReloading(!reloading))
    }


    if (loading) return <Spinner animation='border' className="spinner-border-xl f-flex justify-" />

    return (
        <div>
            <div className='min-vh-100'>
                <h2>Комментарии</h2>
                {comments.length === 0 ? (
                    <h3>Пока нет комментариев</h3>
                ) : (
                    comments.map(comment =>
                        <div key={comment.id} className='border rounded shadow-sm p-3 mb-2'>
                            <Message
                                message={comment}
                                setReply={setReply}
                                deleteMessage={deleteComment}
                            />
                        </div>
                    )
                )}
            </div>

            <ChatInput
                send={postComment}
                reply={reply}
                setReply={setReply}
            />
        </div >
    )
}

export default Comments