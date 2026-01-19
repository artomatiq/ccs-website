import React from "react";

const ImagePreview = ({src, hidden}) => {
    return (
        <div className="" id="preview-div" hidden={hidden}>
            <img src={src} alt="Cropped Ticket Preview" id="preview-img" />
            <div className="rotate-buttons">
                            <button
                                type="button"
                                onClick={null}
                                className="button"
                                id="left"
                                hidden={hidden}
                            >
                                ↺
                            </button><button
                                type="button"
                                onClick={null}
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