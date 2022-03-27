import React from 'react'

export const Image = (props) => {
    return (
        <img src={props.source} alt={props.alt} style={props.style} />
    )
}

export const Text = (props) => {
    return (
        <span style={props.style}>
            {props.children}
        </span>
    )
}

export const TextInput = (props) => {
    return (
        <input
            style={props.style}
            name={props.name}
            placeholder={props.placeholder}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
        />
    )
}

export const TouchableOpacity = (props) => {
    return (
        <div
            className='touchableOpacity'
            style={props.style}
            onClick={props.onClick}
            onMouseDown={e => e.target.style.opacity = 0.4}
            onMouseUp={e => e.target.style.opacity = 1}
        >
            {props.children}
        </div>
    )
}

export const View = (props) => {
    return (
        <div className='view' style={props.style}>
            {props.children}
        </div>
    )
}

