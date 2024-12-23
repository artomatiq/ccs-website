import './App.css';
import { useEffect, useState } from 'react';
import PreLoader from './components/pre-loader/PreLoader';
import Header from './components/header/Header';
import Hero from './components/hero-section/Hero';
import Services from './components/services/Services';
// import Gallery from './components/gallery/Gallery';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Quote from './components/quote/Quote';
import Footer from './components/footer/Footer';

import { Routes, Route, useLocation } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Services />
      <About />
      <Contact />
    </>
  )
}

function App() {

  const location = useLocation();

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'; // Disable default scroll restoration
  }

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
      document.querySelector('.preloader-container').classList.add('hide')
      document.querySelector('.hero-container').classList.add('show')
      document.querySelector('.header-container').classList.add('show')
    }, 4000);

    const titleTimeout = setTimeout(() => {
      document.querySelector('.company-name').classList.add('show')
      document.querySelector('.hero-slogan').classList.add('show')
    }, 5500);

    return () => {
      clearTimeout(timeout)
      clearTimeout(titleTimeout)
    }
  }, []);

  useEffect(() => {
    const disableScroll = (event) => event.preventDefault();

    if (isLoading) {
      window.addEventListener('wheel', disableScroll, { passive: false });
      window.addEventListener('touchmove', disableScroll, { passive: false });
    } else {
      window.removeEventListener('wheel', disableScroll);
      window.removeEventListener('touchmove', disableScroll);
    }
    return () => {
      window.removeEventListener('wheel', disableScroll);
      window.removeEventListener('touchmove', disableScroll);
    };
  }, [isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const title = entry.target.querySelector('.title span');
        if (entry.isIntersecting) {
          title.classList.add("show")
        } else {
          title.classList.remove("show")
        }
      })
    }, { threshold: 0.3 })
    const sections = [...document.querySelectorAll(".section .title")];
    sections.forEach((section) => { if (section === null) console.log(section); observer.observe(section) });
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  return (
    <div className='app-container'>
      <PreLoader />
      <Header />
      <Hero />
      <Routes>
        <Route path='/quote' element={<Quote />} />
        <Route path='*' element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;