import React, { useEffect, useState, useContext } from 'react'
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

    const { fetchComments, postComment: apiPostComment, deleteComment: apiDeleteComment, en } = useContext(AuthContext)

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

            <h2>{en ? 'Comments' : 'Комментарии'}</h2>
            {comments.length === 0 ? (
                <div style={{ height: 150 }} className='d-flex flex-column shadow-sm justify-content-center text-center border rounded p-2' >
                    {en ? 'No comments yet' : 'Пока нет комментариев'}
                </div>

            ) : (
                <div style={{ maxHeight: 'calc(100vh - 310px)', overflowY: 'scroll' }}>
                    {comments.map(comment =>
                        <div key={comment.id} className='border rounded shadow-sm p-3 mb-2'>
                            <Message
                                message={comment}
                                setReply={setReply}
                                deleteMessage={deleteComment}
                            />
                        </div>
                    )}
                </div>

            )}

            <ChatInput
                send={postComment}
                reply={reply}
                setReply={setReply}
            />

        </div >
    )
}

export default Comments