import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="bg-saasha-cream/80 backdrop-blur-md rounded-2xl shadow-lg px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={scrollToTop}
                className="text-2xl font-bold text-saasha-brown hover:text-saasha-rose transition-colors duration-300 cursor-pointer"
              >
                Saasha
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <NavLink text="Home" />
              <NavLink text="About Us" />
              <NavLink text="Team" />
              <NavLink text="Blogs" />
              <NavLink text="Contact" />
              <NavLink text="Register" />
              <a 
                href="https://www.instagram.com/yourusername/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 text-2xl"
              >
                <FaInstagram />
              </a>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-saasha-brown p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-saasha-brown/10">
              <div className="flex flex-col space-y-4">
                <MobileNavLink text="Home" />
                <MobileNavLink text="About Us" />
                <MobileNavLink text="Team" />
                <MobileNavLink text="Blogs" />
                <MobileNavLink text="Contact" />
                <MobileNavLink text="Register" />
                <a 
                  href="https://www.instagram.com/yourusername/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-700 text-2xl block w-full text-center"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ text }: { text: string }) => (
  <a
    href={`#${text.toLowerCase().replace(' ', '-')}`}
    className="text-saasha-brown hover:text-saasha-rose transition-colors duration-300 font-medium"
  >
    {text}
  </a>
);

const MobileNavLink = ({ text }: { text: string }) => (
  <a
    href={`#${text.toLowerCase().replace(' ', '-')}`}
    className="text-saasha-brown hover:text-saasha-rose transition-colors duration-300 font-medium block w-full text-center"
  >
    {text}
  </a>
);

export default Navbar;
