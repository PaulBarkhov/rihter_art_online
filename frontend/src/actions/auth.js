import axios from 'axios'
import Cookies from 'js-cookie'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL
} from './types'

// export const checkAuthentication = () => async dispatch => {
//     try {
//         axios.get(`${process.env.REACT_APP_API_URL}/authentication/check_authentication`)
//             .then(res => {
//                 if (res.data.isAuthenticated) dispatch({
//                     type: AUTHENTICATED_SUCCESS,
//                     payload: true
//                 })
//                 else dispatch({
//                     type: AUTHENTICATED_FAIL,
//                     payload: false
//                 })
//             })
//     } catch (error) {
//         dispatch({
//             type: AUTHENTICATED_FAIL,
//             payload: false
//         })
//     }
// }

export const checkAuthentication = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/authentication/check_authentication`, config)

        console.log(res)

        if (res.data.error || !res.data.isAuthenticated) {
            dispatch({
                type: AUTHENTICATED_FAIL,
                payload: false
            });
        }
        else if (res.data.isAuthenticated) {
            dispatch({
                type: AUTHENTICATED_SUCCESS,
                payload: true
            });
        }
        else {
            dispatch({
                type: AUTHENTICATED_FAIL,
                payload: false
            });
        }
    } catch (err) {
        dispatch({
            type: AUTHENTICATED_FAIL,
            payload: false
        });
    }
};

export const register = (userData) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    }

    const body = JSON.stringify(userData)

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/authentication/register`, body, config)

        if (res.data.error) {
            dispatch({
                type: REGISTER_FAIL
            })
        } else {
            dispatch({
                type: REGISTER_SUCCESS
            })
        }
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

export const login = (userData) => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    }

    const body = JSON.stringify(userData)

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/authentication/login`, body, config)

        if (res.data.success) {
            dispatch({
                type: LOGIN_FAIL
            })
        } else {
            dispatch({
                type: LOGIN_FAIL
            })
        }
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

// export const logout = () => async dispatch => {
//     try {
//         await axios.post(`${process.env.REACT_APP_API_URL}/authentication/logout`,
//             {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': Cookies.get('csrftoken')
//                 },
//                 body: JSON.stringify({ 'withCredentials': true })
//             })
//             .then(res => {
//                 if (res.data.success) dispatch({ type: LOGOUT_SUCCESS })
//                 else dispatch({ type: LOGOUT_FAIL })
//             })
//     } catch (error) {
//         dispatch({ type: LOGOUT_FAIL })
//     }

// }

export const logout = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({
        'withCredentials': true
    });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/authentication/logout`, body, config);

        if (res.data.success) {
            dispatch({
                type: LOGOUT_SUCCESS
            });
        } else {
            dispatch({
                type: LOGOUT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: LOGOUT_FAIL
        });
    }
};