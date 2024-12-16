import './pre-loader.css'
import { useEffect } from 'react';

const PreLoader = () => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            document.querySelector('.preloader-container div').classList.add('show')
        }, 700);

        return () => clearTimeout(timeout)
    }, []);

    

    return (
        <div className='preloader-container'>
            <div>Carolinas Courier Services</div>
        </div>
    );
}

export default PreLoader;