import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="bg-saasha-cream/80 backdrop-blur-md rounded-2xl shadow-lg px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-saasha-brown">Saasha</Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" text="Home" />
              <NavLink to="/about" text="About Us" />
              <NavLink to="/team" text="Team" />
              <NavLink to="/contact" text="Contact" />
              <button className="bg-saasha-rose text-saasha-cream px-6 py-2 rounded-full hover:bg-saasha-brown transition-colors duration-300">
                Volunteer
              </button>
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

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-saasha-brown/10">
              <div className="flex flex-col space-y-4">
                <MobileNavLink to="/" text="Home" />
                <MobileNavLink to="/about" text="About Us" />
                <MobileNavLink to="/team" text="Team" />
                <MobileNavLink to="/whysupport" text="Why Support" />
                <MobileNavLink to="/contact" text="Contact" />
                <button className="bg-saasha-rose text-saasha-cream px-6 py-2 rounded-full hover:bg-saasha-brown transition-colors duration-300 w-full">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, text }: { to: string; text: string }) => (
  <Link
    to={to}
    className="text-saasha-brown hover:text-saasha-rose transition-colors duration-300 font-medium"
  >
    {text}
  </Link>
);

const MobileNavLink = ({ to, text }: { to: string; text: string }) => (
  <Link
    to={to}
    className="text-saasha-brown hover:text-saasha-rose transition-colors duration-300 font-medium block w-full text-center"
  >
    {text}
  </Link>
);

export default Navbar;