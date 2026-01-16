import React from "react";

const ImagePreview = ({src}) => {
    return (
        <div className="">
            <img src={src} alt="Cropped Ticket Preview" />
        </div>
    );
}
export default ImagePreview;