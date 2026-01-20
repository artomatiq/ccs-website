import React from "react";

const ImagePreview = ({ src, setImageSrc, hidden }) => {

    const handleRotate = (e) => {
        const direction = e.target.id
        const angle = direction === "left" ? -90 : 90

        const img = new Image()
        img.src = src

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = img.height
            canvas.height = img.width

            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate((angle * Math.PI) / 180)
            ctx.drawImage(img, -img.width / 2, -img.height / 2)

            setImageSrc(canvas.toDataURL('image/png'))
        }
    }

    return (
        <div className="" id="preview-div" hidden={hidden}>
            <div className="image-wrapper" id="img-wrapper">
                <img src={src} alt="Cropped Ticket Preview" id="preview-img" />
            </div>
            <div className="rotate-buttons">
                <button
                    type="button"
                    onClick={handleRotate}
                    className="button"
                    id="left"
                    hidden={hidden}
                >
                    ↺
                </button><button
                    type="button"
                    onClick={handleRotate}
                    className="button"
                    id="right"
                    hidden={hidden}
                >
                    ↻
                </button>
            </div>
        </div>
    );
}
export default ImagePreview;