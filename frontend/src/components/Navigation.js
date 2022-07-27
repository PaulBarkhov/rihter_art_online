import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Cart as CartIcon } from 'react-bootstrap-icons'
import Cart from './Cart'
import Badge from 'react-bootstrap/Badge'


const Navigation = () => {
    const [expanded, setExpanded] = useState(false)

    const { user, header, cart, en, showCartModal, setShowCartModal } = useContext(AuthContext)

    if (!user) return <></>
    return (
        <>
            <div className="py-2 mb-3 sticky-top" style={{ zIndex: 10000 }}>
                <Navbar bg="light" collapseOnSelect expand="lg" className="border rounded bg-white shadow" expanded={expanded}>
                    <Container className='justify-content-start'>
                        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
                        <Navbar.Brand className='px-2'>{header}</Navbar.Brand>

                        <div style={{ position: 'absolute', top: 5, right: 5, cursor: 'pointer', padding: 10 }}>
                            <CartIcon size='25' onClick={() => setShowCartModal(true)} />
                            <Badge bg="danger" >{cart.length}</Badge>
                        </div>

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

            <Cart
                showCartModal={showCartModal}
                setShowCartModal={setShowCartModal}
            />
        </>
    )
}

export default Navigation