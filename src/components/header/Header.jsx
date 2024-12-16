import './header.css'

const Header = () => {
    return (
        <div className="header-container hide">

            <span className="home nav-button">
                <a href='#home-id'>
                    Home
                </a>
            </span>

            <span className="services nav-button">
                <a href='#services-id'>
                    Services
                </a>
            </span>

            {/* <span className="gallery nav-button">
                <a href='#gallery-id'>
                    Gallery
                </a>
            </span> */}

            <span className="about nav-button">
                <a href='#about-id'>
                    About Us
                </a>
            </span>

            <span className="contact nav-button">
                <a href='#contact-id'>
                    Contact
                </a>
            </span>

            <span className='quote-button nav-button'>
                <a href='#contact-id'>
                    Get Free Quote
                </a>
            </span>

        </div>
    );
}

export default Header;