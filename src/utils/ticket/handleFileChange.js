/* global cv */
import cropTicket from '../../utils/ticket/cropTicketWithCanny';
import Swal from 'sweetalert2';

export default async function handleFileChange({ e, setAttachment, setImageSrc, setPortrait }) {
    function resetState() {
        setAttachment(null)
        setImageSrc(null)
        setPortrait(null)
    }
    const file = e.target.files[0]
    if (file) {
        const MAX_SIZE = 5 * 1024 * 1024
        if (file.size > MAX_SIZE) {
            Swal.fire({
                title: "File too large",
                text: "Please upload an image under 5MB",
                icon: "warning",
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            })
            e.target.value = ""
            resetState()
            return
        }
        setAttachment(file)
        setImageSrc(null)
        setPortrait(null)
    } else return
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = async () => {
        try {
            const dstMat = await cropTicket(img)
            //draw to canvas
            const canvas = document.createElement("canvas")
            const { cols: width, rows: height } = dstMat;
            canvas.width = width;
            canvas.height = height;
            const isPortrait = height >= width
            cv.imshow(canvas, dstMat)
            dstMat.delete()
            setImageSrc(canvas.toDataURL())
            setPortrait(isPortrait)
        } catch (err) {
            console.log(err)
            resetState()
            e.target.value = ""
            Swal.fire({
                title: err.status,
                text: err.message,
                icon: 'warning',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
        }
    }
}