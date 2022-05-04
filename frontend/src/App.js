import React, { lazy, Suspense } from 'react'
import './App.css'

import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import PrivateRoute from './utils/PrivateRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'


import HomePage from './screens/HomePage'
import Account from './screens/Account'
import Login from './screens/auth/Login'
import Registration from './screens/auth/Registration'
import Activate from './screens/auth/Activate'
import Verification from './screens/auth/Verification'
import Course from './components/Course'
import ResetPassword from './screens/auth/ResetPassword'
import ResetPasswordSent from './screens/auth/ResetPasswordSent'
import ResetPasswordConfirm from './screens/auth/ResetPasswordConfirm'
const Lesson = lazy(() => import('./components/Lesson'))
// import Lesson from './components/Lesson'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path='/' exact element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path='course/:courseID' element={<PrivateRoute><Course /></PrivateRoute>} />
          <Route path='lesson/:lessonID' element={<PrivateRoute><Suspense fallback={<h1>Loading...</h1>}><Lesson /></Suspense></PrivateRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='registration' element={<Registration />} />
          <Route path='activate/:uid/:token' element={<Activate />} />
          <Route path='verification' element={<Verification />} />
          <Route path='reset_password' element={<ResetPassword />} />
          <Route path='reset_password_sent' element={<ResetPasswordSent />} />
          <Route path='password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
          <Route path='account' element={<PrivateRoute><Account /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
