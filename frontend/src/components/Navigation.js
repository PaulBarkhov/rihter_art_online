import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'


const Navigation = () => {
    const [expanded, setExpanded] = useState(false)
    const { user, header, en } = useContext(AuthContext)
    if (!user) return <></>
    return (
        <div className="py-2 mb-3 sticky-top" style={{ zIndex: 999099 }}>
            <Navbar bg="light" collapseOnSelect expand="lg" className="border rounded bg-white shadow" expanded={expanded}>
                <Container>
                    <Navbar.Brand>{header}</Navbar.Brand>
                    <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/" onClick={() => setExpanded(false)}>{en ? 'Courses' : 'Курсы'}</Link>
                            {user && <Link className="nav-link" to="profile" onClick={() => setExpanded(false)}>{en ? 'Profile' : 'Профиль'}</Link>}
                            {!user && <Link className="nav-link" to="login" onClick={() => setExpanded(false)}>{en ? 'Login' : 'Войти'}</Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    )
}

export default Navigation