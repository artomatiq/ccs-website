import { useEffect, useState, useRef } from "react"
import { useAuth } from "../../../auth/AuthContext"
import { apiFetch } from "../../../api/apiFetch"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`

export default function InvoicePdfView({ url, token, isDesktop }) {
    const { logout } = useAuth()
    const [blobUrl, setBlobUrl] = useState(null)
    const [error, setError] = useState(null)
    const printIframeRef = useRef(null)

    useEffect(() => {
        const fileId = url.match(/\/d\/([^/]+)/)?.[1]
        if (!fileId) {
            setError("Could not parse Drive file ID from URL")
            return
        }
        const apiBase = process.env.REACT_APP_API_BASE_URL
        let createdUrl
        apiFetch(`${apiBase}/invoices/${fileId}`, {}, logout)
            .then((res) => res.blob())
            .then((blob) => {
                createdUrl = URL.createObjectURL(blob)
                setBlobUrl(createdUrl)
            })
            .catch((err) => setError(err.message))
        return () => {
            if (createdUrl) URL.revokeObjectURL(createdUrl)
        }
    }, [url, logout])

    const handlePrint = () => {
        if (!blobUrl) return
        if (isDesktop) {
            if (!printIframeRef.current) return
            printIframeRef.current.contentWindow.focus()
            printIframeRef.current.contentWindow.print()
        } else {
            const a = document.createElement("a")
            a.href = blobUrl
            a.download = "invoice.pdf"
            a.click()
        }
    }

    return (
        <div className="invoice-pdf-view">
            <iframe
                ref={printIframeRef}
                src={blobUrl}
                style={{ display: "none" }}
                title="Print Invoice"
            />
            <button
                className={`invoice-pdf-print ${!blobUrl ? "is-loading" : "is-ready"}`}
                onClick={handlePrint}
                disabled={!blobUrl}
                aria-busy={!blobUrl}
                aria-label={!blobUrl ? "Fetching invoice from Drive" : "Print Invoice"}
            >
                <span className="scan scan-fwd" aria-hidden="true"></span>
                <span className="scan scan-back" aria-hidden="true"></span>
                <span className="invoice-pdf-print__inner">
                    <i className="bx bx-printer" aria-hidden="true" />
                    <span>{!blobUrl ? "Fetching invoice" : "Print Invoice"}</span>
                </span>
            </button>
            {isDesktop && (
                <div className="invoice-pdf-box">
                    {error && (
                        <div className="invoice-pdf-error">{error}</div>
                    )}
                    {blobUrl && (
                        <Document
                            file={blobUrl}
                            onLoadError={(err) => setError(err.message)}
                        >
                            <Page pageNumber={1} height={600} />
                        </Document>
                    )}
                </div>
            )}
        </div>
    )
}
