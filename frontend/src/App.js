import React from 'react'
import './App.css'

import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import PrivateRoute from './utils/PrivateRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'


import HomePage from './screens/HomePage'
import Account from './screens/Account'
import Login from './screens/auth/Login'
import Registration from './screens/auth/Registration'
import RegistrationVerification from './screens/auth/RegistrationVerification'
import Course from './components/Course'

import Lesson from './components/Lesson'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path='/' exact element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path='course/:courseID' element={<PrivateRoute><Course /></PrivateRoute>} />
          <Route path='lesson/:lessonID' element={<PrivateRoute><Lesson /></PrivateRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='registration' element={<Registration />} />
          <Route path='account' element={<PrivateRoute><Account /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
