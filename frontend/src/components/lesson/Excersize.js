import React, { useState, useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import ChatInput from './ChatInput'
import Message from './Message'
import Spinner from 'react-bootstrap/Spinner'

const Excersize = ({ lessonID }) => {
    const [excersizeData, setExcersizeData] = useState()
    const [reply, setReply] = useState('')

    const [reloader, setReloader] = useState(false)
    const [loading, setLoading] = useState(true)

    const bottomRef = useRef()

    const { fetchExcersizeData, sendExcersizeMessage, deleteExcersizeMessage, user, en } = useContext(AuthContext)

    useEffect(() => {

        fetchExcersizeData(lessonID)
            .then(res => setExcersizeData(res.data))
            .finally(() => setLoading(false))

        // const timeout = setTimeout(() => {
        //     bottomRef.current && bottomRef.current.scrollIntoView({ block: 'end', behavior: 'instant' })
        // }, 200);

        // return () => {
        //     clearTimeout(timeout)
        // }

    }, [lessonID, fetchExcersizeData, reloader])

    const send = (commentText, voice, images) => {
        if (commentText || voice) {
            const formData = new FormData()
            formData.append("text", commentText || '')
            formData.append("voice", voice ? voice.blob : '')
            formData.append("parentID", reply ? reply.id : '')
            images.forEach((image, i) => formData.append(`image_${i}`, image, image.name))

            return sendExcersizeMessage(lessonID, formData)
                .then(res => setReloader(!reloader))
        }
    }

    const deleteMessage = async (messageID) => {
        return deleteExcersizeMessage(lessonID, excersizeData.excersize.id, messageID)
            .then(res => setReloader(!reloader))
    }

    const renderDangerousHTML = () => {
        return { __html: excersizeData.excersize.text }
    }

    if (loading) return <div className='w-100 text-center pt-4'><Spinner animation='border' className="spinner-border-xl f-flex justify-" /></div>

    return (
        <div>
            <h2 className='text-lg-center'>{en ? 'Excersize' : 'Задание'}</h2>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <div className="col-lg-8 border rounded p-2 shadow-sm mb-2">
                    {!excersizeData.excersize.text ?
                        <div style={{ height: 150 }} className="d-flex flex-column justify-content-center text-center">
                            {en ? 'No excersize' : 'Задания нет'}
                        </div>
                        :
                        <div dangerouslySetInnerHTML={renderDangerousHTML()}></div>
                    }

                </div>
                {excersizeData.reviews.map(review => review.review_messages.map(message => {
                    if (!message.parent) {
                        return <div key={message.id} className='col-lg-8 border rounded shadow-sm mb-2 p-3' >
                            <Message
                                message={message}
                                deleteMessage={deleteMessage}
                                setReply={setReply}
                            />
                        </div>
                    }
                }))}
                <div className='col-lg-8 col-12' >
                    {(reply || excersizeData.reviews.length === 0) && <ChatInput send={send} reply={reply} setReply={setReply} />}
                    <div style={{ height: 70 }} id="bottomAnchor" ref={bottomRef}></div>
                </div>

            </div>



        </div>
    )
}

export default Excersize