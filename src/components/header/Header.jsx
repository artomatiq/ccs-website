import './header.css'

const Header = () => {
    return (
        <div className="header-container">
            <span className="home nav-button">
                Home
            </span>
            <span className="services nav-button">
                Services
            </span>
            <span className="gallery nav-button">
                Gallery
            </span>
            <span className="about nav-button">
                About
            </span>
            <span className="contact nav-button"> 
                Contact
            </span>
            <span className='quote-button nav-button'>
                Get Free Quote
            </span>
        </div>
    );
}

export default Header;