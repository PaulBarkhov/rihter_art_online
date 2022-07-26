import React, { useContext, useState, useLayoutEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EditProfile from './EditProfile'
import OffsetSpinner from '../components/OffsetSpinner'

const initialState = {
    username: '',
    first_name: '',
    last_name: '',
    profile_image: '',
    about_self: '',
    birth_date: '',
    sex: '',
    phone_number: ''
}

function Account() {
    const [profileData, setProfileData] = useState(initialState)
    const [editMode, setEditMode] = useState(false)
    const [offset, setOffset] = useState(100) //animation


    const navigate = useNavigate()

    const { fetchProfileData, logout, en } = useContext(AuthContext)

    useLayoutEffect(() => {
        if (!editMode) fetchProfileData()
            .then(res => setProfileData(res.data))
            .finally(() => setOffset(0))
    }, [fetchProfileData, editMode])

    if (editMode) return <EditProfile oldProfileData={profileData} setEditMode={setEditMode} />

    return (
        <div
            style={{ transform: `translateX(${offset}%)`, transition: 'transform 0.2s ease' }}
            className='d-flex justify-content-center'>

            {offset === 100 && <OffsetSpinner />}

            <div className='col-md-7 col-12 border rounded shadow p-4'>
                <div className='d-flex flex-column w-100 align-items-center justify-content-center mb-2'>
                    <img src={profileData.profile_image} alt='Profile' style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, borderRadius: 100, marginBottom: 10, objectFit: 'cover', textAlign: 'center' }} />
                    <h2>{profileData.first_name} {profileData.last_name}</h2>
                    <h6>{profileData.username}</h6>
                </div>
                {profileData.birth_date && <p><b>{en ? 'Birth date: ' : 'Дата рождения: '}</b>{profileData.birth_date}</p>}
                {profileData.sex !== 'не указан' && profileData.sex !== 'Unspecified' && <p><b>{en ? 'Gender: ' : 'Пол: '}</b>{profileData.sex}</p>}
                {profileData.phone_number && <p><b>{en ? 'Phone number: ' : 'Номер телефона: '}</b>{profileData.phone_number}</p>}
                {profileData.about_self && <p><b>{en ? 'About myself: ' : 'О себе: '}</b>{profileData.about_self}</p>}

                <div className='d-flex flex-column flex-sm-row'>
                    <button className='btn btn-outline-primary m-1' onClick={() => setEditMode(true)}>{en ? 'Edit' : 'Редактировать'}</button>
                    <button className='btn btn-outline-secondary m-1' onClick={() => navigate('/')}>{en ? 'Home Page' : 'На главную'}</button>
                    <button className='btn btn-outline-danger m-1' onClick={logout}>{en ? 'Logout' : 'Выйти'}</button>
                </div>
            </div>
        </div>
    )
}

export default Account

