import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'


const Navigation = () => {
    const [expanded, setExpanded] = useState(false)
    const { user, header } = useContext(AuthContext)
    if (!user) return <></>
    return (
        <Navbar bg="light" collapseOnSelect expand="lg" className="my-2 border rounded bg-white shadow-sm" expanded={expanded}>
            <Container>
                <Navbar.Brand>{header}</Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/" onClick={() => setExpanded(false)}>Курсы</Link>
                        {user && <Link className="nav-link" to="profile" onClick={() => setExpanded(false)}>Профиль</Link>}
                        {!user && <Link className="nav-link" to="login" onClick={() => setExpanded(false)}>Войти</Link>}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation