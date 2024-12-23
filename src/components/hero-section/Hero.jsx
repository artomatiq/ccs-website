import './hero.css'

const Hero = () => {
    return (
        <div className="hero-container hide" id='home-id'>
            <div className="company-name">
                <div className="one">Carolinas</div>
                <div className="two">
                    <i className="fa-solid fa-truck-fast"></i>
                    <div>Courier</div>
                </div>
                <div className="three">Services</div>
            </div>
            <div className="hero-slogan">
                Driven to deliver.
            </div>
        </div>
    );
}

export default Hero;