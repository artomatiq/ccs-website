import { useEffect, useRef } from "react"

const AdminWelcome = () => {
    const spanRef = useRef(null)
    useEffect(() => {
        const timer = setTimeout(() => {
            spanRef.current?.classList.add("show")
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="title section segment">
            <span ref={spanRef} className="hide">
                Welcome
            </span>
        </div>
    )
}

export default AdminWelcome
