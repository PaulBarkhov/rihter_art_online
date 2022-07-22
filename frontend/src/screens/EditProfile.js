import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import ProfileImageModal from '../components/ProfileImageModal'

const EditProfile = ({ oldProfileData, setEditMode }) => {
    const [profileData, setProfileData] = useState({ ...oldProfileData })
    const [profile_image, setProfile_image] = useState(oldProfileData.profile_image)
    const [showModal, setShowModal] = useState(false)

    const { updateProfileData, updateProfileImage, en } = useContext(AuthContext)

    const handleSubmit = async e => {
        e.preventDefault()
        updateProfileData(profileData)
            .then(res => {
                setEditMode(false)
            })
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
                profile_image={profile_image}
                updateProfileImage={updateProfileImage}
                unmountModal={unmountModal}
                en={en}
            />}

            <div className='w-100 d-flex justify-content-center'>
                <div className='col-lg-7 col-12 border rounded shadow p-4'>
                    <div className='d-flex flex-column w-100 align-items-center justify-content-center mb-2'>
                        <img
                            src={profile_image}
                            alt='Profile'
                            style={{ width: 150, height: 150, borderRadius: 100, marginBottom: 10, objectFit: 'cover' }}
                            onClick={() => setShowModal(true)}
                        />
                    </div>
                    <form onSubmit={e => handleSubmit(e)}>
                        <div className='form-group mb-2'>
                            <label htmlFor='first_name'>{en ? 'First name' : 'Имя'}</label>
                            <input
                                name='first_name'
                                type='text'
                                className='form-control'
                                value={profileData.first_name}
                                onChange={e => setProfileData({ ...profileData, first_name: e.target.value })}
                            />
                        </div>
                        <div className='form-group mb-2'>
                            <label htmlFor='last_name'>{en ? 'Last name' : 'Фамилия'}</label>
                            <input
                                name='last_name'
                                type='text'
                                className='form-control'
                                value={profileData.last_name}
                                onChange={e => setProfileData({ ...profileData, last_name: e.target.value })}
                            />
                        </div>

                        <div className='row'>
                            <div className='col-6'>
                                <label htmlFor='birth_date'>{en ? 'Birth date' : 'Дата рождения'}</label>
                                <input
                                    type='date'
                                    name='birth_date'
                                    className='form-control'
                                    value={profileData.birth_date}
                                    onChange={e => setProfileData({ ...profileData, birth_date: e.target.value })}
                                />
                            </div>
                            <div className='col-6 form-group mb-2'>
                                <label htmlFor='sex'>Пол</label>
                                <select
                                    name='sex'
                                    className='form-select'
                                    value={profileData.sex}
                                    onChange={e => setProfileData({ ...profileData, sex: e.target.value })}
                                >
                                    <option>{en ? 'Male' : 'Мужской'}</option>
                                    <option>{en ? 'Female' : 'Женский'}</option>
                                    <option>{en ? 'Unspecified' : 'не указан'}</option>
                                </select>
                            </div>
                        </div>

                        <div className='form-group mb-2'>
                            <label htmlFor='phone_number'>{en ? 'Phone number' : 'Номер телефона'}</label>
                            <input
                                type='tel'
                                className='form-control'
                                value={profileData.phone_number}
                                onChange={e => setProfileData({ ...profileData, phone_number: e.target.value })}
                            />
                        </div>

                        <div className='form-group mb-2'>
                            <label htmlFor='about_self'>{en ? 'О себе' : 'About self'}</label>
                            <textarea
                                rows={3}
                                className='form-control'
                                value={profileData.about_self}
                                onChange={e => setProfileData({ ...profileData, about_self: e.target.value })}
                            />
                        </div>

                        <button className='btn btn-success' type='submit'>{en ? 'Save' : 'Сохранить'}</button>
                        <button className='btn btn-outline-secondary m-2' onClick={() => setEditMode(false)}>{en ? 'Cancel' : 'Отмена'}</button>
                    </form>

                </div>
            </div>
        </>
    )
}

export default EditProfile