import React, { useState, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const UploadedImage = ({ image, setPreviews }) => {

    const [imageModalShown, setImageModalShown] = useState(false)
    const [contextMenuShown, setContextMenuShown] = useState(false)

    const menuRef = useRef()

    const en = true

    const confirmDelete = () => {
        setPreviews(prev => prev.filter(prevImage => prevImage !== image))
    }

    return (
        <div>
            <img
                style={{
                    maxHeight: 100,
                    marginBottom: 5,
                    marginRight: 5,
                    objectFit: 'contain',
                    borderRadius: 5
                }}
                src={image}
                alt='preview'
                onClick={e => setImageModalShown(true)} />

            <ul
                ref={menuRef}
                style={{
                    display: contextMenuShown ? 'block' : 'none'
                }}
                className="dropdown-menu p-2 shadow"
                role="menu"
                aria-labelledby="dropdownMenu">
                <li>Open</li><hr />
                <li>Delete</li>
            </ul>

            <Modal show={imageModalShown} onHide={() => setImageModalShown(false)} centered>
                <Modal.Body>
                    <img
                        src={image}
                        alt="profile_image"
                        width="100%"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                    >
                        {en ? 'Удалить' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default UploadedImage