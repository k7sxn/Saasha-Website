import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const MainApp = () => {
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if user already has access
    const storedAccess = localStorage.getItem('hasAccess');
    
    // If ?admin is in URL, grant access
    if (location.search.includes('?admin')) {
      localStorage.setItem('hasAccess', 'true');
      setHasAccess(true);
    } 
    // If access was previously granted, maintain it
    else if (storedAccess === 'true') {
      setHasAccess(true);
    }
  }, [location.search]);

  // Mock blog data (replace with actual data from your backend)
  const mockPosts = [
    {
      id: '1',
      title: 'Our First Community Event',
      content: '<p>Details about our first community event...</p>',
      headerImage: 'https://example.com/image1.jpg',
      tags: ['community', 'events'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: 'our-first-community-event'
    }
  ];

  if (!hasAccess) {
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
        <Route path="/blog" element={<BlogList posts={mockPosts} />} />
        <Route path="/blog/:slug" element={<BlogPost post={mockPosts[0]} />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <DarkModeToggle />
    </div>
  );
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;