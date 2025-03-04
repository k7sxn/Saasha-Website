import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WhySupport from './components/WhySupport';
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
          <Route path="/team" element={<div>Team Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;