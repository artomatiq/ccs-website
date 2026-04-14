import "./pre-loader.css"
import { useEffect } from "react"

import symbol from "../../assets/eternity.png"

const PreLoader = () => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            document
                .querySelector(".preloader-container div")
                ?.classList.add("show")
            document.querySelector("#symbol-png")?.classList.add("show")
        }, 700)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="preloader-container">
            <div>Carolinas Courier Services</div>
            <img src={symbol} id="symbol-png" alt="Company logo"/>
        </div>
    )
}

export default PreLoader
