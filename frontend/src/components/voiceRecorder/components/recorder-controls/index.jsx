// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMicrophone, faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import { Mic, StopCircle, X } from "react-bootstrap-icons"
import { formatMinutes, formatSeconds } from "../../utils/format-time"
import "./styles.css"

export default function RecorderControls({ recorderState, handlers }) {
  const { recordingMinutes, recordingSeconds, initRecording } = recorderState
  const { startRecording, saveRecording, cancelRecording } = handlers

  return (
    <div className="position-relative">
      <div style={{ position: 'absolute', transform: 'translateY(-100%)', background: 'white' }}>
        <div >
          {initRecording && <div>
            <span>{formatMinutes(recordingMinutes)}</span>
            <span>:</span>
            <span>{formatSeconds(recordingSeconds)}</span>
          </div>}
        </div>
        {/* {initRecording && <button className="btn btn-secondary" onClick={cancelRecording}><X /></button>} */}
      </div>
      <div>
        {initRecording ? (
          <button
            className="btn btn-danger"
            disabled={recordingSeconds === 0}
            onClick={saveRecording}
          >
            <StopCircle />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={startRecording}><Mic /></button>
        )}
      </div>
    </div>
  )
}
