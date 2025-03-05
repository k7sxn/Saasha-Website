import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import WhySupport from './components/WhySupport';
import Team from './components/Team';
import Volunteer from './components/Volunteer';
import Footer from './components/Footer';
import Donate from './components/Donate';
import DarkModeToggle from './components/DarkModeToggle';
import ComingSoon from './components/ComingSoon';

const MainApp = () => {
  const location = useLocation();
  const isAdmin = location.search.includes('?admin');

  if (!isAdmin) {
    return <ComingSoon />;
  }

  return (
    <div className="min-h-screen bg-saasha-cream dark:bg-dark-primary dark:text-dark-text transition-colors duration-200">
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
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/whysupport" element={<WhySupport />} />
      </Routes>
      <Footer />
      <DarkModeToggle />
    </div>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <MainApp />
      </Router>
    </DarkModeProvider>
  );
}

export default App;