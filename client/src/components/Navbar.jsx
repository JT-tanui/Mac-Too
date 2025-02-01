import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">Mac Too</Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/about" className="hover:text-gray-300">About</Link>
            <Link to="/services" className="hover:text-gray-300">Services</Link>
            <Link to="/portfolio" className="hover:text-gray-300">Portfolio</Link>
            <Link to="/blog" className="hover:text-gray-300">Blog</Link>
            <Link to="/contact" className="hover:text-gray-300">Contact</Link>
            
            {/* Only show dashboard and logout when authenticated */}
            {authState.isAuthenticated && (
              <>
                <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <button onClick={logout} className="hover:text-gray-300">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;