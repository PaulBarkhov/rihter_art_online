import React, { useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'

const Video = ({ video }) => {
    const [loading, setLoading] = useState(true)

    return (
        <div key={Math.random()} className="mb-3 p-3 text-center d-flex flex-column align-items-center shadow-sm border rounded">
            <h1>{video.name}</h1>
            {loading && <div style={{ height: 500, width: 290, border: '1px solid grey', borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><Spinner animation="border" role="status" /></div>}
            <iframe
                style={{
                    display: loading && "none",
                    border: '1px solid grey',
                    borderRadius: 5,
                    height: 500,
                    width: 290
                }}
                onLoad={() => setLoading(false)}
                src={video.player_embed_url}
                allow="autoplay; fullscreen; picture-in-picture"
                title={video.name}>
            </iframe>
        </div>
    )
}

export default Video