import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/admin" className="flex items-center px-3 py-2">Dashboard</Link>
              <Link to="/admin/blog" className="flex items-center px-3 py-2">Blog</Link>
              <Link to="/admin/services" className="flex items-center px-3 py-2">Services</Link>
              <Link to="/admin/portfolio" className="flex items-center px-3 py-2">Portfolio</Link>
            </div>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;