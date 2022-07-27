import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const MessageImage = ({ image }) => {
    const [imageModalShown, setImageModalShown] = useState(false)

    return (
        <>
            <img
                src={image.image}
                alt="comment imag"
                style={{
                    width: 'calc(35% - 30px)',
                    marginRight: 10,
                    marginBottom: 10,
                    borderRadius: 5
                }}
                onClick={() => setImageModalShown(true)}
            />

            <Modal show={imageModalShown} onHide={() => setImageModalShown(false)} centered>
                <Modal.Body>
                    <img
                        src={image.image}
                        alt="profile_image"
                        width="100%"
                    />
                </Modal.Body>
            </Modal>
        </>

    )
}

export default MessageImage