import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-saasha-brown text-saasha-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">We'd Love to Hear from You</h2>
          <p className="text-lg text-saasha-cream/80 max-w-2xl mx-auto">
            We're here to assist you with any questions, support, or partnership inquiries - reach out to us today.
          </p>
          <button className="mt-8 bg-saasha-rose hover:bg-saasha-rose/90 text-saasha-cream px-8 py-3 rounded-full transition-colors duration-300">
            Contact Us
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Our Story</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Team</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Careers</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Causes</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Education</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Healthcare</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Environment</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Events</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Upcoming</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Past Events</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Gallery</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Get in Touch</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">Support</a></li>
              <li><a href="#" className="hover:text-saasha-rose transition-colors duration-300">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-saasha-cream/20 text-center text-sm text-saasha-cream/60">
          <p>© {new Date().getFullYear()} Saasha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;