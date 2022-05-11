import React, { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProfileImageModal from '../components/ProfileImageModal'

const EditProfile = ({ oldProfileData, setEditMode }) => {
    const { tokens, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [profileData, setProfileData] = useState({
        first_name: oldProfileData.first_name,
        last_name: oldProfileData.last_name,
        about_self: oldProfileData.about_self,
        birth_date: oldProfileData.birth_date,
        sex: oldProfileData.sex,
        phone_number: oldProfileData.phone_number
    })

    const [profile_image, setProfile_image] = useState(oldProfileData.profile_image)

    const [showModal, setShowModal] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        const config = { headers: { "Authorization": `JWT ${tokens.access}` } }
        await axios.post(`${process.env.REACT_APP_API_URL}/profile/update`, profileData, config)
            .then(res => {
                setEditMode(false)
            })
            .catch(err => err.response.status === 401 ? logout() : console.log(err.response))
    }

    const unmountModal = preview => {
        if (preview) setProfile_image(preview)
        setTimeout(() => {
            setShowModal(false)
        }, 500);
    }

    return (
        <>
            {showModal && <ProfileImageModal
                unmountModal={unmountModal}
                profile_image={profile_image}
                tokens={tokens}
                navigate={navigate}
                logout={logout}
            />
            }

            <div className="w-100 d-flex justify-content-center">
                <div className="col-lg-7 col-12 border rounded shadow p-4">
                    <div className="d-flex flex-column w-100 align-items-center justify-content-center mb-2">
                        <img
                            src={profile_image}
                            alt="Profile"
                            style={{ width: 200, height: 200, borderRadius: 100, marginBottom: 10, objectFit: 'cover' }}
                            onClick={() => setShowModal(true)}
                        />
                    </div>
                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="form-group mb-2">
                            <label htmlFor="first_name">Имя</label>
                            <input
                                name="first_name"
                                type="text"
                                className="form-control"
                                value={profileData.first_name}
                                onChange={e => setProfileData({ ...profileData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="last_name">Фамилия</label>
                            <input
                                name="last_name"
                                type="text"
                                className="form-control"
                                value={profileData.last_name}
                                onChange={e => setProfileData({ ...profileData, last_name: e.target.value })}
                            />
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="birth_date">Дата рождения</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    className="form-control"
                                    value={profileData.birth_date}
                                    onChange={e => setProfileData({ ...profileData, birth_date: e.target.value })}
                                />
                            </div>
                            <div className="col-6 form-group mb-2">
                                <label htmlFor="sex">Пол</label>
                                <select
                                    name="sex"
                                    className="form-select"
                                    value={profileData.sex}
                                    onChange={e => setProfileData({ ...profileData, sex: e.target.value })}
                                >
                                    <option>Мужской</option>
                                    <option>Женский</option>
                                    <option>не указан</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="phone_number">Номер телефона</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={profileData.phone_number}
                                onChange={e => setProfileData({ ...profileData, phone_number: e.target.value })}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="about_self">О себе</label>
                            <textarea
                                rows={3}
                                className="form-control"
                                value={profileData.about_self}
                                onChange={e => setProfileData({ ...profileData, about_self: e.target.value })}
                            />
                        </div>

                        <button className="btn btn-success" type="submit">Сохранить</button>
                        <button className="btn btn-outline-secondary m-2" onClick={() => setEditMode(false)}>Отмена</button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default EditProfile