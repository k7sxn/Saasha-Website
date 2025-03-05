import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import WhySupport from './components/WhySupport';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-saasha-cream">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <About />
              <WhySupport />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/whysupport" element={<WhySupport />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;