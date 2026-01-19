import './header.css'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()

    const handleClick = (e, targetId) => {
        e.preventDefault()
        navigate(`/`)
        setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView()
        }, 250);
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

            <span className="ticket-button nav-button">
                <Link to='ticket'>
                    Ticket
                </Link>
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