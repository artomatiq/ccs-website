import './gallery.css'

const Gallery = () => {
    return (
        <div className="gallery-container section">
            <div className="title">
                <span className="hide">
                    Vehicles
                </span>
            </div>

            <div className="contents">
                <div className="top">
                    <div className="sprinter-graphic">
                        This is the Sprinter graphic
                    </div>
                    <div className="sprinter-info">
                        This is the Sprinter Info
                    </div>
                </div>
                <div className="bottom">
                    <div className="truck-graphic">
                        This is the truck graphic
                    </div>
                    <div className="truck-info">
                        this is the truck info
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Gallery;