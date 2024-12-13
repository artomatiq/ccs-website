import './App.css';
import { useEffect } from 'react';
import Header from './components/header/Header';
import Hero from './components/hero-section/Hero';
import Services from './components/services/Services';
import Gallery from './components/gallery/Gallery';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';

function App() {

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const title = entry.target.querySelector('.title span');
        if (!title ) console.log('here is the null title', entry);
        if (entry.isIntersecting) {
          title.classList.add("show")
        } else {
          title.classList.remove("show")
        }
      })
    }, { threshold: 0.4 })

    const sections = [...document.querySelectorAll(".section")];
    sections.pop() //remove the footer
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className='app-container'>
      <Header />
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
