import React from 'react'
import './App.css'
import HomePage from './screens/HomePage'
import Account from './screens/Account'
import Login from './screens/auth/Login'
import Registration from './screens/auth/Registration'
import RegistrationVerification from './screens/auth/RegistrationVerification'
import LessonsList from './screens/LessonsList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store'

import Layout from './hocs/Layout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route exact path='/' element={<HomePage />}>
              <Route path=':courseID' element={<LessonsList />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/registrationVerification' element={<RegistrationVerification />} />
            <Route path='/account' element={<Account />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App
