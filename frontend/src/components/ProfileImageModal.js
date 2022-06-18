import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import resizeFile from '../utils/resize'

const ProfileImageModal = ({ profile_image, tokens, navigate, unmountModal, logout }) => {

    const [showModal, setShowModal] = useState(true)

    const [uploadedImage, setUploadedImage] = useState()
    const [thumbnail, setThumbnail] = useState()
    const [preview, setPreview] = useState()

    const imageInputRef = useRef()

    useEffect(() => {
        return () => {
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
            formData.append("thumbnail", thumbnail)

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
                    onChange={async e => {
                        try {
                            const file = e.target.files[0]
                            console.log('Размер до: ' + file.size / 1000 / 1000 + 'мб')
                            const image = await resizeFile(file, 1000, 1000, 80)
                            console.log('Размер после: ' + (image.size / 1000 / 1000).toFixed(2) + 'мб')
                            const thumb = await resizeFile(file, 300, 300, 50)
                            console.log('Размер thumbnail`а: ' + (thumb.size / 1000 / 1000).toFixed(2) + 'мб')
                            setThumbnail(thumb)
                            setUploadedImage(image)
                        } catch (err) {
                            console.log(err)
                        }
                    }}
                />
            </Modal.Body>
        </Modal>
    )
}

export default ProfileImageModal