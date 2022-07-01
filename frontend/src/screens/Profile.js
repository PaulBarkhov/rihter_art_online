import React, { useContext, useState, useLayoutEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import EditProfile from './EditProfile'

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

    const navigate = useNavigate()

    const { fetchProfileData, logout } = useContext(AuthContext)

    useLayoutEffect(() => {
        if (!editMode) fetchProfileData().then(res => setProfileData(res.data))
    }, [fetchProfileData, editMode])

    if (editMode) return <EditProfile oldProfileData={profileData} setEditMode={setEditMode} />

    return (
        <div className='d-flex justify-content-center'>
            <div className='col-md-7 col-12 border rounded shadow p-4'>
                <div className='d-flex flex-column w-100 align-items-center justify-content-center mb-2'>
                    <img src={profileData.profile_image} alt='Profile' style={{ width: 150, minWidth: 150, height: 150, minHeight: 150, borderRadius: 100, marginBottom: 10, objectFit: 'cover', textAlign: 'center' }} />
                    <h2>{profileData.first_name} {profileData.last_name}</h2>
                    <h6>{profileData.username}</h6>
                </div>
                {profileData.birth_date && <p><b>Дата рождения: </b>{profileData.birth_date}</p>}
                {profileData.sex !== 'не указан' && <p><b>Пол: </b>{profileData.sex}</p>}
                {profileData.phone_number && <p><b>Номер телефона: </b>{profileData.phone_number}</p>}
                {profileData.about_self && <p><b>О себе: </b>{profileData.about_self}</p>}

                <div className='d-flex flex-column flex-sm-row'>
                    <button className='btn btn-outline-primary m-1' onClick={() => setEditMode(true)}>Редактировать</button>
                    <button className='btn btn-outline-secondary m-1' onClick={() => navigate('/')}>На главную</button>
                    <button className='btn btn-outline-danger m-1' onClick={logout}>Выйти</button>
                </div>
            </div>
        </div>
    )
}

export default Account

