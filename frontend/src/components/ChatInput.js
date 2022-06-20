import React, { useState, useRef, useEffect } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import { ArrowRight, X } from 'react-bootstrap-icons'
import VoiceRecorder from './voiceRecorder/VoiceRecorder'
import autosize from 'autosize'

const ChatInput = ({ send, reply, setReply }) => {
    const [recording, setRecording] = useState(false)
    const [voice, setVoice] = useState()
    const [commentText, setCommentText] = useState('')
    // const [reply, setReply] = useState()

    const textareaRef = useRef()

    useEffect(() => { autosize(textareaRef.current) }, [])

    useEffect(() => {
        if (reply) {
            textareaRef.current.focus()
        }
    }, [reply])

    const handleSend = () => {
        send(commentText, voice).finally(() => {
            setCommentText('')
            setVoice(null)
            setReply(null)
        })
    }

    return (
        <div className="p-2 fixed-bottom bg-white" >
            <div className="d-flex flex-row ">
                {voice ? (
                    <div className='w-100'>
                        <AudioPlayer
                            src={voice.audio}
                            layout="horizontal-reverse"
                            showJumpControls={false}
                            autoPlayAfterSrcChange={false}
                            showDownloadProgress={false}
                            customAdditionalControls={[]}
                            customVolumeControls={[]}
                        />

                    </div>
                ) : (
                    <div className="w-100">
                        <textarea
                            ref={textareaRef}
                            rows="1"
                            className="form-control"
                            style={{ maxHeight: 150, resizeL: "none" }}
                            name="commentTextArea"
                            id="commentTextArea"
                            disabled={recording}
                            onChange={e => setCommentText(e.target.value)}
                            value={commentText}
                        />
                        <div className="position-absolute bg-white" style={{ top: -15, left: "1rem" }}>
                            <span>{reply ? `${reply.user.first_name} ${reply.user.last_name},` : "Ваш комментарий:"}</span>
                            {reply && <X color="red" size="20" onClick={() => setReply('')} />}
                        </div>
                    </div>
                )}

                {commentText || voice ? (
                    <div className="fixed-right d-flex flex-row">
                        {voice && <button className="btn btn-danger mx-1" onClick={() => setVoice(null)}><X size="20" /></button>}
                        <button className="btn btn-primary" onClick={handleSend}><ArrowRight size="20" /></button>
                    </div>
                ) : (
                    <VoiceRecorder setVoice={setVoice} setRecording={setRecording} />
                )}
            </div>
        </div>

    )
}

export default ChatInput