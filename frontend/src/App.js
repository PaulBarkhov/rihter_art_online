import React from 'react'
import './App.css'
import axios from 'axios'

import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import PrivateRoute from './utils/PrivateRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'


import HomePage from './screens/HomePage'
import Account from './screens/Account'
import Login from './screens/auth/Login'
import Registration from './screens/auth/Registration'
import RegistrationVerification from './screens/auth/RegistrationVerification'
import LessonsList from './screens/LessonsList'

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  // const [loading, setLoading] = React.useState(false)
  // const [token, setToken] = React.useState('')
  // const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  // React.useEffect(() => {
  //   checkAuthentication()
  // }, [])

  // const checkAuthentication = async () => {
  //   try {
  //     await axios.get(`${process.env.REACT_APP_API_URL}/authentication/check_authentication`)
  //       .then(res => {
  //         if (res.data.error) console.log(res.data.error)
  //         else {
  //           console.log(res.data.isAuthenticated)
  //           setIsAuthenticated(res.data.isAuthenticated)
  //           setLoading(false)
  //         }
  //       })
  //   } catch (err) { console.log(err) }
  // }

  // if (loading) return <h1>Loading...</h1>

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path='/' exact element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path=':courseID' element={<PrivateRoute><LessonsList /></PrivateRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='registration' element={<Registration />} />
          <Route path='account' element={<PrivateRoute><Account /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App
