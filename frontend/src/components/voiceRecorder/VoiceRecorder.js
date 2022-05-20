import RecorderControls from "./components/recorder-controls"
import useRecorder from "./hooks/useRecorder"
import { useEffect } from "react"

const VoiceRecorder = ({ setVoice }) => {
    const { recorderState, ...handlers } = useRecorder()
    const { audio, blob } = recorderState

    useEffect(() => {
        if (audio) setVoice({ audio: audio, blob: blob })
    }, [audio, blob, setVoice])

    return (
        <RecorderControls recorderState={recorderState} handlers={handlers} />
    )
}

export default VoiceRecorder