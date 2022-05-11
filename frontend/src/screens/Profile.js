import React, { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditProfile from './EditProfile'

function Account() {
    const { tokens, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const [editMode, setEditMode] = useState(false)

    const [profileData, setProfileData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        profile_image: '',
        about_self: '',
        birth_date: '',
        sex: '',
        phone_number: ''
    })

    useEffect(() => {
        if (!editMode) {
            const fetchProfileData = async () => {
                const config = {
                    headers: {
                        'Authorization': `JWT ${tokens.access}`
                    }
                }
                await axios.get(`${process.env.REACT_APP_API_URL}/profile/me`, config)
                    .then(res => setProfileData({
                        username: res.data.username,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        profile_image: res.data.profile_image,
                        about_self: res.data.about_self,
                        birth_date: res.data.birth_date,
                        sex: res.data.sex,
                        phone_number: res.data.phone_number
                    }))
                    .catch(err => err.response.status === 401 && logout())
            }
            fetchProfileData()
        }
    }, [logout, tokens, navigate, editMode])


    if (editMode) return (
        <EditProfile oldProfileData={profileData} setEditMode={setEditMode} />
    )

    return (
        <div className="d-flex justify-content-center">
            <div className="col-md-7 col-12 border rounded shadow p-4">
                <div className="d-flex flex-column w-100 align-items-center justify-content-center mb-2">
                    <img src={profileData.profile_image} alt="Profile" style={{ width: 200, height: 200, borderRadius: 100, marginBottom: 10, objectFit: 'cover' }} />
                    <h2>{profileData.first_name} {profileData.last_name}</h2>
                    <h6>{profileData.username}</h6>
                </div>
                {profileData.birth_date && <p><b>Дата рождения: </b>{profileData.birth_date}</p>}
                {profileData.sex !== "не указан" && <p><b>Пол: </b>{profileData.sex}</p>}
                {profileData.phone_number && <p><b>Номер телефона: </b>{profileData.phone_number}</p>}
                {profileData.about_self && <p><b>О себе: </b>{profileData.about_self}</p>}

                <div className="d-flex flex-column flex-sm-row">
                    <button className="btn btn-outline-primary m-1" onClick={() => setEditMode(true)}>Редактировать</button>
                    <button className="btn btn-outline-secondary m-1" onClick={() => navigate("/")}>На главную</button>
                    <button className="btn btn-outline-danger m-1" onClick={logout}>Выйти</button>
                </div>
            </div>
        </div>

    )
}


export default Account

