
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-deep-blue/80 backdrop-blur-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white font-semibold text-xl">
          <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">MCQ Generator</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className={`text-white/80 hover:text-white transition-colors ${
              isActive('/') ? 'text-white' : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/features"
            className={`text-white/80 hover:text-white transition-colors ${
              isActive('/features') ? 'text-white' : ''
            }`}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className={`text-white/80 hover:text-white transition-colors ${
              isActive('/contact') ? 'text-white' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="text-white border border-white/30 hover:border-white/60 px-4 py-2 rounded-full transition-all duration-300"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-light-teal to-deep-blue text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-light-teal/20 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-deep-blue/95 backdrop-blur-lg z-50 flex flex-col justify-center items-center transition-all duration-300 md:hidden ${
            isMenuOpen
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-full pointer-events-none'
          }`}
        >
          <button
            className="absolute top-5 right-5 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
          <nav className="flex flex-col space-y-6 items-center">
            <Link
              to="/"
              className="text-white/80 hover:text-white text-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-white/80 hover:text-white text-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/contact"
              className="text-white/80 hover:text-white text-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-4 mt-8 w-full items-center">
              <Link
                to="/login"
                className="text-white border border-white/30 hover:border-white/60 px-6 py-2 rounded-full transition-all duration-300 w-40 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-light-teal to-deep-blue text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-light-teal/20 transition-all duration-300 w-40 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
