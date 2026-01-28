export default async function uploadToS3(ticket, token) {
    try {
        //get presigned url
        const presignRes = await fetch(process.env.REACT_APP_API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({fileType: ticket.type})
        })
        if (!presignRes.ok) throw new Error("Failed to get presigned URL")
        const { uploadURL, key, ticketId } = await presignRes.json()

        //upload to s3
        const uploadRes = await fetch (uploadURL, {
            method: "PUT",
            headers: {"Content-Type": ticket.type},
            body: ticket
        })
        if (!uploadRes.ok) throw new Error("S3 upload failed")
        return { key, ticketId }
    } catch (err) {
        console.error("uploadToS3 error:", err)
        throw err
    }
}