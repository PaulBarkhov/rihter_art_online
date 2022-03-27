import React from 'react'
import './App.css'
import axios from 'axios'

import AuthContext from './context/AuthContext'

import HomePage from './screens/HomePage'
import Account from './screens/Account'
import Login from './screens/auth/Login'
import Registration from './screens/auth/Registration'
import RegistrationVerification from './screens/auth/RegistrationVerification'
import LessonsList from './screens/LessonsList'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


function App() {
  const [loading, setLoading] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/authentication/check_authentication`)
        .then(res => {
          if (res.data.error) console.log(res.data.error)
          else {
            console.log(res.data.isAuthenticated)
            setIsAuthenticated(res.data.isAuthenticated)
            setLoading(false)
          }
        })
    } catch (err) { console.log(err) }
  }

  const LoginRequired = ({ children }) => {
    console.log(isAuthenticated)
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account' }} replace />
    else return children
  }

  if (loading) return <h1>Loading...</h1>

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          <Route exact path='/' element={<LoginRequired><HomePage /></LoginRequired>}>
            <Route path=':courseID' element={<LessonsList />} />
          </Route>
          <Route path='/login' element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path='/registration' element={isAuthenticated ? <Navigate to="/" replace /> : <Registration />} />
          <Route path='/registrationVerification' element={<RegistrationVerification />} />
          <Route path='/account' element={<LoginRequired><Account /></LoginRequired>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
