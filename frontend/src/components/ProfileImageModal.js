import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'


const ProfileImageModal = ({ profile_image, tokens, navigate, unmountModal, logout }) => {

    const [showModal, setShowModal] = useState(true)

    const [uploadedImage, setUploadedImage] = useState()
    const [preview, setPreview] = useState()

    const imageInputRef = useRef()

    useEffect(() => {
        console.log('Did mount')
        return () => {
            console.log('Did unmount')
            setUploadedImage(null)
            setPreview(null)
        }

    }, [])

    useEffect(() => {
        if (uploadedImage) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(uploadedImage)
        } else setPreview(null)
    }, [uploadedImage])

    const saveProfileImage = async () => {
        const formData = new FormData()

        if (uploadedImage) {
            formData.append("profile_image", uploadedImage)

            const config = {
                headers: {
                    "Authorization": `JWT ${tokens.access}`,
                    "Content-Type": "multipart/form-data"
                }
            }
            await axios.post(`${process.env.REACT_APP_API_URL}/profile/update_profile_image`, formData, config)
                .then(res => {
                    setShowModal(false)
                    unmountModal(preview)
                })
                .catch(err => err.response.status === 401 ? logout() : console.log(err.response.data))
        }
    }

    const handleCancel = () => {
        setShowModal(false)
        unmountModal(null)
    }

    return (
        <Modal show={showModal} onHide={handleCancel} centered>
            <Modal.Body>
                <img
                    src={preview ? preview : profile_image}
                    alt="profile_image"
                    width="100%"
                />

                <div className="d-flex flex-row justify-content-end pt-3">
                    <button className={`btn btn-outline-success mx-1 ${!uploadedImage && "d-none"}`} onClick={saveProfileImage}>Сохранить</button>
                    <button className={`btn btn-outline-primary mx-1 ${uploadedImage && "d-none"}`} onClick={() => imageInputRef.current.click()}>Сменить</button>
                    <button className="btn btn-outline-secondary" onClick={handleCancel}>Отмена</button>
                </div>

                <input
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    type="file"
                    name="profile_image"
                    id="profile_image"
                    accept="image/*"
                    onChange={e => {
                        const file = e.target.files[0]
                        if (file && file.type.substring(0, 5) === "image") setUploadedImage(file)
                    }}
                />
            </Modal.Body>
        </Modal>
    )
}

export default ProfileImageModal