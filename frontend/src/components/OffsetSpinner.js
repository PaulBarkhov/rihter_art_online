import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const OffsetSpinner = () => {
    return (
        <div
            className='container'
            style={{
                position: 'absolute',
                height: 'calc(100vh - 74px)',
                transform: `translateX(-100%)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Spinner animation='border' className="spinner-border-xl" />
        </div>
    )
}

export default OffsetSpinner