import './footer.css'

const Footer = () => {
    return (
        <div className="footer-container section">
            <div className="top">
                <div className="logo">
                    <div className="one">Carolinas</div>
                    <div className="two">
                        <i class="fa-solid fa-truck-fast"></i><div>Courier</div>
                    </div>
                    <div className="three">Services</div>
                </div>
                <div className="get-quote">
                    Get Free Quote
                </div>
                <div className="links">
                    <div className="home">Home</div>
                    <div className="services">Services</div>
                    <div className="gallery">Gallery</div>
                    <div className="about">About Us</div>
                    <div className="contact">Contact</div>
                </div>
            </div>
            <div className="bottom">
                <div className="copyright">
                    © Carolinas Courier Services. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Footer;