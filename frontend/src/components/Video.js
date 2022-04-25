import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const Video = ({ video }) => {
    return (
        <div key={Math.random()} className="mb-2 text-center">
            <h1>{video.name}</h1>
            <iframe src={video.player_embed_url} width="100%" height="500" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" title="2 сердце boys .MOV"></iframe>
        </div>
    )
}

export default Video