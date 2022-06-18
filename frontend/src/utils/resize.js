import Resizer from "react-image-file-resizer"

const resizeFile = (file, maxWidth = 300, maxHeight = 300, quality = 100) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            maxWidth,
            maxHeight,
            "JPEG",
            quality,
            0,
            (uri) => {
                resolve(uri)
            },
            // "base64"
            "file"
        )
    })
export default resizeFile