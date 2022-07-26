import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const OffsetSpinner = () => {
    return (
        <div
            style={{
                position: 'absolute',
                width: '100vw',
                height: 'calc(100vh - 74px)',
                transform: `translateX(calc(-100% + 10px))`,
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