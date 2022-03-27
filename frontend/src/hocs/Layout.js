import React from 'react'
import Navbar from '../components/Navbar'
import { connect } from 'react-redux'
import { checkAuthentication } from '../actions/auth'
import { load_user } from '../actions/profile'

const Layout = ({ children, checkAuthentication, load_user }) => {
    React.useEffect(() => {
        checkAuthentication();
        load_user();
    }, [checkAuthentication, load_user]);

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default connect(null, { checkAuthentication, load_user })(Layout);