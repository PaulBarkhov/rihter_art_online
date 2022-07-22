import React, { useState, useRef, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Accordion } from 'react-bootstrap'
import Message from './Message'

const MessagesStaffView = ({ lessonID, reviews }) => {
    const [reply, setReply] = useState('')

    const bottomRef = useRef()

    const { sendExcersizeMessage, deleteExcersizeMessage, user } = useContext(AuthContext)

    const send = (commentText, voice) => {
        if (commentText || voice) {
            const formData = new FormData()
            formData.append("text", commentText || '')
            formData.append("voice", voice ? voice.blob : '')
            formData.append("parentID", reply ? reply.id : '')

            return sendExcersizeMessage(lessonID, formData)
            // .then(res => setReloader(!reloader))
        }
    }

    // const deleteMessage = async (messageID) => {
    //     deleteExcersizeMessage(lessonID, excersizeData.excersize.id, messageID)
    //     // .then(res => setReloader(!reloader))
    // }

    return (
        <>
            <Accordion>
                {reviews.map(review =>
                    <Accordion.Item key={review.id} eventKey={review.id}>
                        <Accordion.Header>
                            <div>
                                <div className="d-flex flex-row align-items-center mb-3">
                                    <img src={review.review_messages[0].user.profile.thumbnail} alt="profile_image" width="50" height="50" style={{ borderRadius: 100, marginRight: 15, objectFit: 'cover' }} />
                                    <div>
                                        <h4>{review.review_messages[0].user.first_name} {review.review_messages[0].user.last_name}</h4>
                                        {/* <span className='text-muted'>{message.user.email}</span> */}
                                        <span className='text-muted'>{review.review_messages[0].date}</span>
                                    </div>
                                </div>
                                {/* <span>{review.review_messages[review.review_messages.length - 1].text}</span> */}
                                <span>Статус: {review.profile.user}</span>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body style={{ padding: 10 }}>
                            {review.review_messages.map((message, i, row) =>
                                <div key={message.id} className='border rounded shadow-sm mb-2 p-3' >
                                    <Message
                                        message={message}
                                        // deleteMessage={deleteMessage}
                                        setReply={setReply}
                                    />
                                </div>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion>
            {/* {(reply || !excersizeData.reviews) && <ChatInput send={send} reply={reply} setReply={setReply} />}
            <div style={{ height: 70 }} id="bottomAnchor" ref={bottomRef}></div> */}
        </>
    )
}

export default MessagesStaffView