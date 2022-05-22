import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ProgressBar } from 'react-bootstrap'
import { PlayFill, StopFill, X } from 'react-bootstrap-icons'
import formatTime from "../utils/format-time"

const initialState = {
    isPlaying: false,
    isEnded: false,
    isPaused: false,
    currentTime: 0,
    duration: 0
}

const AudioPlayer = ({ voice, setVoice }) => {
    const [playerState, setPlayerState] = useState(initialState)
    const [loading, setLoading] = useState(true)

    const [play, setPlay] = useState(false)

    const audioRef = useRef()
    const audioElement = useRef(new Audio(voice))

    const playButtonRef = useRef()

    useLayoutEffect(() => {
        audioRef.current && audioRef.current.load()
        setLoading(false)
    }, [])

    useLayoutEffect(() => {
        audioRef.current && (play ? audioRef.current.play() : audioRef.current.pause())
    }, [play])

    // useEffect(() => {
    //     audioElement.current.load()
    //     const play = () => {
    //         audioElement.current.play()
    //     }
    //     if (playButtonRef.current) playButtonRef.current.addEventListener('click', play)
    //     return () => playButtonRef.current.removeEventListener('click', play)
    // }, [loading])


    if (loading) return <span>Voice loading...</span>

    return (
        <div className="w-100 d-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-end w-100">
                {/* <button className="btn btn-primary" onClick={() => audioElement.current.load()}>LOAD</button> */}
                <audio
                    preload='auto'
                    ref={audioRef}
                    controls
                    style={{ display: 'none' }}
                    src={voice}
                    onLoadedData={e => {
                        if (e.target.duration === Infinity) {
                            e.target.currentTime = 1e101
                            e.target.ontimeupdate = function () {
                                this.ontimeupdate = () => {
                                    return
                                }
                                e.target.currentTime = 0
                                return
                            }
                        }
                    }}

                    onCanPlay={e => e.target.duration !== Infinity && setPlayerState({ ...playerState, duration: e.target.duration })}

                    onPlay={() => setPlayerState({ ...playerState, isPlaying: true, isEnded: false })}
                    onEnded={() => setPlayerState({ ...playerState, isPlaying: false, isEnded: true })}
                    onPause={() => setPlayerState({ ...playerState, isPlaying: false, isPaused: true })}
                    onTimeUpdate={e => setPlayerState({ ...playerState, currentTime: e.target.currentTime })}
                />
                {playerState.isPlaying ? (
                    <button className="btn btn-warning" onClick={() => setPlay(false)}><StopFill /></button>
                ) : (
                    <button ref={playButtonRef} className="btn btn-primary" onClick={() => setPlay(true)}><PlayFill /></button>
                )}

                <div className="d-flex flex-column mx-2 w-100">
                    <ProgressBar now={playerState.currentTime / playerState.duration * 100} style={{ width: "100%", height: 5 }} />
                    <div className="d-flex flex-row justify-content-between">
                        <span className="">{formatTime(playerState.currentTime)}</span>
                        <span>{formatTime(playerState.duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer