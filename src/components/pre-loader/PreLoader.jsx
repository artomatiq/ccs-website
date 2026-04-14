import "./pre-loader.css"
import { useEffect, useState } from "react"
import symbol from "../../assets/eternity.png"

const PreLoader = ({ isLoading }) => {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowContent(true)
        }, 700)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className={`preloader-container ${isLoading ? "" : "hide"}`}>
            <div className={showContent ? "show" : ""}>
                Carolinas Courier Services
            </div>

            <img
                src={symbol}
                id="symbol-png"
                className={showContent ? "show" : ""}
                alt="Company logo"
            />
        </div>
    )
}

export default PreLoader