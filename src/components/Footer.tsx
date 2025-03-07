import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-saasha-brown dark:bg-dark-secondary text-saasha-cream py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">We'd Love to Hear from You</h2>
          <p className="text-lg text-saasha-cream/80 max-w-2xl mx-auto">
            We're here to assist you with any questions, support, or partnership inquiries - reach out to us today.
          </p>
          <Link 
            to="/contact"
            className="mt-8 inline-block bg-saasha-rose hover:bg-saasha-rose/90 dark:bg-dark-accent dark:hover:bg-dark-accent/90 text-saasha-cream px-8 py-3 rounded-full transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Our Story</Link></li>
              <li><Link to="/team" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Team</Link></li>
              <li><Link to="/volunteer" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Volunteer</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Causes</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Education</Link></li>
              <li><Link to="/" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Healthcare</Link></li>
              <li><Link to="/" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Environment</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Events</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Upcoming</Link></li>
              <li><Link to="/events" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Past Events</Link></li>
              <li><Link to="/gallery" className="hover:text-saasha-rose dark:hover:text-dark-accent transition-colors duration-300">Gallery</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose/80">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-saasha-cream/20 text-center text-sm text-saasha-cream/60">
          <p> {new Date().getFullYear()} Saasha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;