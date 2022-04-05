import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace /> //returning to initialy requested screen isn't working
    else return children
}

export default PrivateRoute