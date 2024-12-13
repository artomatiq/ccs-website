import './services.css'

const Services = () => {
    return (
        <div className="services-container section">
            <div className="title">
                <span className="hide">
                    Services
                </span>
            </div>

            <div className="contents">
                <div className="service one">
                    <div className="logo">
                        <i className='bx bx-sun'></i>
                    </div>
                    <div className="subtitle">
                        Same-day
                    </div>
                </div>
                <div className="service four">
                    <div className="logo">
                        <i className='bx bxs-fast-forward-circle' ></i>
                    </div>
                    <div className="subtitle">
                        Next-day
                    </div>
                </div>
                <div className="service five">
                    <div className="logo">
                        <i className='bx bxs-moon'></i>
                    </div>
                    <div className="subtitle">
                        Overnight
                    </div>
                </div>
                <div className="service two">
                    <div className="logo">
                        <i className='bx bxs-calendar' ></i>
                    </div>
                    <div className="subtitle">
                        Scheduled Service
                    </div>
                </div>
                <div className="service three">
                    <div className="logo">
                        <i className='bx bxs-calendar-check' ></i>
                    </div>
                    <div className="subtitle">
                        Dedicated Service
                    </div>
                </div>
                <div className="service eight">
                    <div className="logo">
                        <i className="fa-solid fa-truck"></i>
                    </div>
                    <div className="subtitle">
                        Freight
                    </div>
                </div>
                <div className="service six">
                    <div className="logo">
                        <i className="fa-solid fa-couch"></i>
                    </div>
                    <div className="subtitle">
                        Furniture & Large Item
                    </div>
                </div>
                <div className="service nine">
                    <div className="logo">
                        <i className='bx bxs-factory' ></i>
                    </div>
                    <div className="subtitle">
                        B2B
                    </div>
                </div>
                <div className="service seven">
                    <div className="logo">
                        <i className="fa-solid fa-puzzle-piece"></i>
                    </div>
                    <div className="subtitle">
                        Custom Solutions
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Services;