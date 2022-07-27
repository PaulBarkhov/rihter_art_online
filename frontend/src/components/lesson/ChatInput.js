import React, { useState, useRef, useEffect } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
import { ArrowRight, Paperclip, X } from 'react-bootstrap-icons'
import VoiceRecorder from '../voiceRecorder/VoiceRecorder'
import autosize from 'autosize'
import resizeFile from '../../utils/resize'
import UploadedImage from './UploadedImage';

const ChatInput = ({ send, reply, setReply }) => {
    const [recording, setRecording] = useState(false)
    const [voice, setVoice] = useState()
    const [commentText, setCommentText] = useState('')
    const [uploadedImages, setUploadedImages] = useState([])
    const [previews, setPreviews] = useState([])

    const textareaRef = useRef()
    const imageInputRef = useRef()

    useEffect(() => { autosize(textareaRef.current) }, [])

    useEffect(() => {
        if (reply) {
            textareaRef.current.focus()
        }
    }, [reply])


    useEffect(() => {
        return () => {
            setUploadedImages([])
            setPreviews([])
        }
    }, [])

    const handleSend = () => {
        console.log(uploadedImages)
        send(commentText, voice, uploadedImages).finally(() => {
            setCommentText('')
            setVoice(null)
            setReply(null)
            setPreviews([])
            setUploadedImages([])
        })
    }

    return (
        <div className="py-2" style={{ position: 'sticky', bottom: 0 }}>

            {!!previews.length &&
                <div style={{ display: 'flex', overflowX: 'auto', marginBottom: 5 }}>
                    {previews.map(preview => <UploadedImage key={Math.random()} image={preview} setPreviews={setPreviews} />)}
                </div>
            }

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
                    <div className="w-100" style={{ position: 'relative' }}>

                        {reply &&
                            <div className="position-absolute bg-white" style={{ top: -15, left: "1rem" }}>
                                <span>{reply.user.first_name} {reply.user.last_name}</span>
                                <X color="red" size="20" onClick={() => setReply('')} />
                            </div>
                        }


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

                        <Paperclip
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10
                            }}
                            size='20'
                            onClick={() => imageInputRef.current.click()}
                        />

                        <input
                            ref={imageInputRef}
                            style={{ display: "none" }}
                            type="file"
                            multiple
                            name="profile_image"
                            id="profile_image"
                            accept="image/*"
                            onChange={async e => {
                                try {
                                    const files = e.target.files
                                    for (let i = 0; i < files.length; i++) {
                                        console.log('Размер до: ' + files[i].size / 1000 / 1000 + 'мб')
                                        const image = await resizeFile(files[i], 1000, 1000, 80)
                                        console.log('Размер после: ' + (image.size / 1000 / 1000).toFixed(2) + 'мб')
                                        setUploadedImages(current => [...current, image])
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setPreviews(current => [...current, reader.result])
                                        }
                                        reader.readAsDataURL(image)
                                    }
                                } catch (err) {
                                    console.log(err)
                                }
                            }}
                        />


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