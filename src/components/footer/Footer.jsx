import './footer.css'

const Footer = () => {

    const handleScroll = () => {
        document.querySelector('#contact-id').scrollIntoView()
    }

    return (
        <div className="footer-container section">
            <div className="top">
                <div className="logo">
                    <div className="one">Carolinas</div>
                    <div className="two">
                        <i className="fa-solid fa-truck-fast"></i><div>Courier</div>
                    </div>
                    <div className="three">Services</div>
                </div>
                <div className="get-quote" onClick={handleScroll}>
                    Get Free Quote
                </div>
                <div className="links">
                    <div className="home">
                        <a href='#home-id'>
                            Home
                        </a>
                    </div>
                    <div className="services">
                        <a href='#services-id'>
                            Services
                        </a>
                    </div>
                    {/* <div className="gallery">
                        <a href='#gallery-id'>
                            Gallery
                        </a>
                    </div> */}
                    <div className="about">
                        <a href='#about-id'>
                            About Us
                        </a>
                    </div>
                    <div className="contact">
                        <a href='#contact-id'>
                            Contact
                        </a>
                    </div>
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