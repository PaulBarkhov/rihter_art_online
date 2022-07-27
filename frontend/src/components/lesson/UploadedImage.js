import React, { useState, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const UploadedImage = ({ image, setPreviews }) => {

    const [deleteModalShown, setDeleteModalShown] = useState(false)
    const [contextMenuShown, setContextMenuShown] = useState(false)

    const menuRef = useRef()

    const en = true

    const handleImageRightClick = (e, image) => {
        e.preventDefault()
        setContextMenuShown(true)
        window.addEventListener('click', (event) => {
            if (event.target.innerHTML === 'Delete') {
                setDeleteModalShown(true)
            }
            setContextMenuShown(false)

        }, { once: true })
    }

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
                onContextMenu={e => handleImageRightClick(e, image)} />

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

            <Modal
                show={deleteModalShown}
                onHide={() => setDeleteModalShown(false)}
                backdrop="static"
                size="sm"
                keyboard={false}
                // aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    {en ? 'Delete this image?' : 'Удалить изображение?'}
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModalShown(false)}>
                        {en ? 'Cancel' : 'Отмена'}
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        {en ? 'Yes' : 'Да'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UploadedImage