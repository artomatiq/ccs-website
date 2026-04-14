import { useEffect, useState } from "react"
import "./hero.css"

const Hero = ({ isLoading, setIsLoading }) => {
    const [showHero, setShowHero] = useState(false)
    const [showTitles, setShowTitles] = useState(false)

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
            setShowHero(true)
        }, 4000)

        const titleTimer = setTimeout(() => {
            setShowTitles(true)
        }, 5500)

        return () => {
            clearTimeout(loadingTimer)
            clearTimeout(titleTimer)
        }
    }, [])

    return (
        <div className="hero-precontainer">
            <div className={`hero-container ${showHero ? "show" : ""}`} id="home-id">
                <div className={`company-name ${showTitles ? "show" : ""}`}>
                    <div className="one">Carolinas</div>
                    <div className="two">
                        <i className="fa-solid fa-truck-fast"></i>
                        <div>Courier</div>
                    </div>
                    <div className="three">Services</div>
                </div>
                <div className={`hero-slogan ${showTitles ? "show" : ""}`}>Driven to deliver.</div>
            </div>
        </div>
    )
}

export default Hero
