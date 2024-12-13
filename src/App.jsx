import './App.css';
import Header from './components/header/Header';
import Hero from './components/hero-section/Hero';
import Services from './components/services/Services';
import Gallery from './components/gallery/Gallery';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';

function App() {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log('printing entries', entries);
      const title = entry.target;
      if (entry.isIntersecting) {
        title.classList.add("show")
      } else {
        title.classList.remove("show")
      }
    })
  }, {threshold: 0.4})

  document.querySelectorAll(".section").forEach((title) => {
    console.log('printing title:', title);
    observer.observe(title)
  })

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
