import './header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const handleClick = (e, targetId) => {
        if (location.pathname === '/quote') {
            e.preventDefault()
            navigate(`/`)
            setTimeout(() => {
                document.getElementById(targetId)?.scrollIntoView()
            }, 250);
        }
    }

    return (
        <div className="header-container hide">

            <span className="home nav-button" onClick={(e) => handleClick(e, 'home-id')}>
                <a href='#home-id'>
                    Home
                </a>
            </span>

            <span className="services nav-button" onClick={(e) => handleClick(e, 'services-id')}>
                <a href='#services-id'>
                    Services
                </a>
            </span>

            {/* <span className="gallery nav-button">
                <a href='#gallery-id'>
                    Gallery
                </a>
            </span> */}

            <span className="about nav-button" onClick={(e) => handleClick(e, 'about-id')}>
                <a href='#about-id'>
                    About Us
                </a>
            </span>

            <span className="contact nav-button" onClick={(e) => handleClick(e, 'contact-id')}>
                <a href='#contact-id'>
                    Contact
                </a>
            </span>

            <span className='quote-button nav-button'>
                <Link to='quote'>
                    Get Free Quote
                </Link>
            </span>

        </div>
    );
}

export default Header;