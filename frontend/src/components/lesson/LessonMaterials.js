import React from 'react'
import Video from './Video'

const LessonMaterials = ({ lessonData }) => {
    return (
        <>
            <div className='mb-4'>
                {lessonData.videos && lessonData.videos.map(video => <Video key={Math.random()} video={video} />)}
            </div>
            <div className="d-flex flex-column flex-md-row flex-lg-wrap justify-content-lg-between pb-4">
                {lessonData.lesson.photos && lessonData.lesson.photos.map(photo =>
                    <div key={photo.id} className='col-md-6'>
                        <div
                            className="mx-md-1 mb-3 p-2 border rounded shadow-sm text-center">
                            <h4>{photo.name}</h4>
                            <img key={photo.id} src={photo.url} alt={photo.name} width="100%" className='border rounded shadow-sm' />
                        </div>
                    </div>

                )}
            </div>
        </>
    )
}

export const MemorizedLessonMaterials = React.memo(LessonMaterials)
