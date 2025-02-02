import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt 
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="w-1/5 flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 whitespace-nowrap">
              Mac & Too<span className="text-blue-600"> Agency</span>
            </Link>
          </div>

          {/* Main Menu - Desktop */}
          <div className="hidden md:flex w-3/5 items-center justify-end pr-8">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 text-md font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 text-md font-medium">About</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 text-md font-medium">Services</Link>
              <Link to="/portfolio" className="text-gray-700 hover:text-blue-600 text-md font-medium">Portfolio</Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600 text-md font-medium">Blog</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 text-md font-medium">Contact</Link>
            </div>
          </div>

          {/* Auth Section - 20% */}
          <div className="hidden md:flex w-1/5 items-center justify-end">
            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <Link 
                  to="/admin/dashboard"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/contact#form"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started Today
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
          <div className="h-full w-full flex items-start justify-center pt-5">
            {/* Mobile Navigation Menu Content */}
            <div className="bg-white w-11/12 max-w-md mx-auto rounded-lg shadow-xl overflow-hidden">
              {/* Brand Header with Tagline */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="text-xl font-bold text-gray-800">
                  Mac & Too<span className="text-blue-600"> Agency</span>
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Transform Your Digital Presence Today
                </p>
              </div>

              {/* Close Button */}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 rounded-full bg-white/90 text-gray-500 hover:text-gray-700"
                >
                  <HiX className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="p-6 space-y-4">
                <Link to="/" className="block text-center text-gray-700 hover:text-blue-600 text-lg font-medium py-2">Home</Link>
                <Link to="/about" className="block text-center text-gray-700 hover:text-blue-600 text-lg font-medium py-2">About</Link>
                <Link to="/services" className="block text-center text-gray-700 hover:text-blue-600 text-lg font-medium py-2">Services</Link>
                <Link to="/portfolio" className="block text-center text-gray-700 hover:text-blue-600 text-lg font-medium py-2">Portfolio</Link>
                <Link to="/blog" className="block text-center text-gray-700 hover:text-blue-600 text-lg font-medium py-2">Blog</Link>
                <Link to="/contact" className="block text-center text-gray-700 hover:text-blue-600 text-lg font-medium py-2">Contact</Link>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4">
                <div className="flex items-center justify-center space-x-6">
                  <a href="tel:+1234567890" className="flex items-center text-gray-600 hover:text-blue-600">
                    <FaPhone className="h-4 w-4 mr-2" />
                    <span className="text-sm">Call Us</span>
                  </a>
                  <a href="mailto:info@example.com" className="flex items-center text-gray-600 hover:text-blue-600">
                    <FaEnvelope className="h-4 w-4 mr-2" />
                    <span className="text-sm">Email</span>
                  </a>
                  <a href="/contact" className="flex items-center text-gray-600 hover:text-blue-600">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                    <span className="text-sm">Visit Us</span>
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-100 p-6">
                <div className="flex justify-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaFacebookF className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaTwitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaInstagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaLinkedinIn className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Auth Section */}
              {authState.isAuthenticated ? (
                <div className="border-t border-gray-100 p-6 space-y-3">
                  <Link 
                    to="/admin/dashboard"
                    className="block text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-center px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 p-6">
                  <Link 
                    to="/contact#form"
                    className="block text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Get Started Today
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;