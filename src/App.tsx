import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WhySupport from './components/WhySupport';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-saasha-cream">
      <Navbar />
      <Hero />
      <About />
      <WhySupport />
      <Footer />
    </div>
  );
}

export default App;