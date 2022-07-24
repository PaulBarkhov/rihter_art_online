import React, { useState, useContext } from 'react'
import { Reply, X } from 'react-bootstrap-icons'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
import { AuthContext } from '../../context/AuthContext'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'

const Message = ({ message, deleteMessage, setReply }) => {
    const [deleteModalShown, setDeleteModalShown] = useState(false)
    const [repliesShown, setRepliesShown] = useState(!!message.parent)

    const { user, en } = useContext(AuthContext)

    const handleDelete = () => {
        setDeleteModalShown(true)
    }

    const confirmDelete = async () => {
        deleteMessage(message.id)
            .finally(() => setDeleteModalShown(false))
    }

    return (
        <div style={{ position: 'relative' }}>
            <div className="d-flex flex-row align-items-center mb-3">
                <img src={message.user.profile.thumbnail} alt="profile_image" width="50" height="50" style={{ borderRadius: 100, marginRight: 15, objectFit: 'cover' }} />
                <div>
                    <h4>{message.user.first_name} {message.user.last_name}</h4>
                    {/* <span className='text-muted'>{message.user.email}</span> */}
                    <span className='text-muted'>{message.date}</span>
                </div>
            </div>
            <span>{message.text}</span>
            {
                message.voice && <AudioPlayer
                    src={message.voice}
                    layout="horizontal-reverse"
                    showJumpControls={false}
                    autoPlayAfterSrcChange={false}
                    showDownloadProgress={false}
                    customAdditionalControls={[]}
                    customVolumeControls={[]}
                />
            }
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                {
                    message.user.id === user.user_id ? (
                        <X style={{ color: 'red', fontSize: '2rem' }} onClick={handleDelete} />
                    ) : (
                        <Reply style={{ fontSize: '2rem' }} onClick={() => setReply(message)} />
                    )
                }
            </div>

            {(!!message.children.length && !message.parent && !repliesShown) &&
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '0.8rem'
                    }}
                    aria-controls={`collapse${message.id}`}
                    aria-expanded={repliesShown}
                    onClick={() => setRepliesShown(true)}
                >
                    {en ? 'Show replies' : 'Показать ответы'}
                </div>
            }


            {message.children && <Collapse in={repliesShown}>
                <div id={`collapse${message.id}`}>
                    <div style={{ borderLeft: '1px solid grey', paddingLeft: '1rem', marginTop: '1rem' }}>
                        {message.children && message.children.map(childMessage =>
                            <Message
                                key={`childMessage${childMessage.id}`}
                                message={childMessage}
                                deleteMessage={deleteMessage}
                                setReply={setReply}
                            />
                        )}
                        {!message.parent && <div style={{ textAlign: 'right', fontSize: '0.8rem' }} onClick={() => setRepliesShown(false)}>{en ? 'hide replies' : 'Открыть ответы'}</div>}
                    </div>
                </div>
            </Collapse>}


            <Modal
                show={deleteModalShown}
                onHide={() => setDeleteModalShown(false)}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    {en ? 'Are you sure you want to delete this message?' : 'Вы уверены, что хотите удалить сообщение?'}
                </Modal.Header>
                {/* <Modal.Body>{en ? 'Are you sure you want to delete this message?' : 'Вы уверены, что хотите удалить сообщение?'}</Modal.Body> */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModalShown(false)}>
                        {en ? 'Cancel' : 'Отмена'}
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        {en ? 'Yes' : 'Да'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >

    )
}

export default Message