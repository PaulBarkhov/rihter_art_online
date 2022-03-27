import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../actions/auth'

const navbar = ({ isAuthenticated, logout }) => {
    const authLinks = (
        <>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/account'>Аккаунт</NavLink>
            </li>
            <li className='nav-item'>
                <a className='nav-link' onClick={logout} href='#!'>Выйти</a>
            </li>
        </>
    )

    const guestLinks = (
        <>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/login'>Войти</NavLink>
            </li>
            <li className='nav-item'>
                <NavLink className='nav-link' to='/registration'>Регистрация</NavLink>
            </li>
        </>
    )

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <div className='container-fluid'>
                <Link className='navbar-brand' exact to='/'>Rihter Art Online</Link>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNav'
                    aria-controls='navbarNav'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' exact to='/'>Главная</NavLink>
                        </li>
                        {isAuthenticated ? authLinks : guestLinks}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { logout })(navbar)