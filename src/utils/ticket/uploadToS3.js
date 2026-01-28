export default async function uploadToS3(imgSrc, token) {
    try {
        if (!imgSrc) throw new Error("No image source provided")
        //convert imgSrc data URL to file
        const dataURLToFile = (dataurl, filename = "ticket") => {
            const arr = dataurl.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) u8arr[n] = bstr.charCodeAt(n)
            return new File( [u8arr], filename, {type: mime})
        }
        const fileToUpload = dataURLToFile(imgSrc)
        //get presigned url
        const presignRes = await fetch(process.env.REACT_APP_API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ fileType: fileToUpload.type })
        })
        if (!presignRes.ok) throw new Error("Failed to get presigned URL")
        const { uploadURL, key, ticketId } = await presignRes.json()
        //upload to s3
        const uploadRes = await fetch(uploadURL, {
            method: "PUT",
            headers: { "Content-Type": fileToUpload.type },
            body: fileToUpload
        })
        if (!uploadRes.ok) throw new Error("S3 upload failed")
        return { key, ticketId }
    } catch (err) {
        console.error("uploadToS3 error:", err)
        throw err
    }
}