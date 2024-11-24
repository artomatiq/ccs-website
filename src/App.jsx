import './App.css';
import Header from './components/header/Header';
import Hero from './components/hero-section/Hero';
import Services from './components/services/Services';
import Gallery from './components/gallery/Gallery';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className='app-container'>
      <Header/>
      <Hero/>
      <Services/>
      <Gallery/>
      <About/>
      <Contact/>
      <Footer/>
    </div>
  );
}

export default App;
