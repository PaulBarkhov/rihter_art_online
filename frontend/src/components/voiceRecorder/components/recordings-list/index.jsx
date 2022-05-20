// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrashAlt, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import useRecordingsList from "../../hooks/use-recordings-list"
import "./styles.css"

export default function RecordingsList({ audio }) {
  const { recordings, deleteAudio } = useRecordingsList(audio)

  return (
    <div >
      {recordings.length > 0 ? (
        <>
          <h1>Your recordings</h1>
          <div>
            {recordings.map((record) => (
              <div key={record.key}>
                <audio controls src={record.audio} />
                <div className="delete-button-container">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteAudio(record.key)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <span>You don't have records</span>
        </div>
      )}
    </div>
  )
}
