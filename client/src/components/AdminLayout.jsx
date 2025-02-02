import React, { useContext } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  FiGrid, 
  FiFileText, 
  FiBriefcase, 
  FiFolder, 
  FiMail, 
  FiSettings, 
  FiUsers,
  FiLogOut,
  FiImage,
  FiMessageSquare,
  FiActivity,
  FiUser
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const { authState, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!authState.isAuthenticated || !authState.token) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
    {
      label: 'Content',
      icon: FiFolder,
      children: [
        { path: '/admin/blog', icon: FiFileText, label: 'Blog Posts' },
        { path: '/admin/services', icon: FiBriefcase, label: 'Services' },
        { path: '/admin/portfolio', icon: FiImage, label: 'Portfolio' },
        { path: '/admin/testimonials', icon: FiMessageSquare, label: 'Testimonials' }
      ]
    },
    {
      label: 'Management',
      icon: FiUsers,
      children: [
        { path: '/admin/team', icon: FiUser, label: 'Team' },
        { path: '/admin/gallery', icon: FiImage, label: 'Gallery' },
        { path: '/admin/newsletter', icon: FiMail, label: 'Newsletter' },
        { path: '/admin/messages', icon: FiMessageSquare, label: 'Messages' }
      ]
    },
    {
      label: 'System',
      icon: FiSettings,
      children: [
        { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
        { path: '/admin/activity', icon: FiActivity, label: 'Activity Log' }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    return <Navigate to="/admin/login" replace />;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 pt-16">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
                {navItems.map((item, index) => (
                  item.children ? (
                    <div key={index} className="space-y-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </div>
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.path}
                          className={`${
                            location.pathname === child.path
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                        >
                          <child.icon className="mr-3 h-5 w-5" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={index}
                      to={item.path}
                      className={`${
                        location.pathname === item.path
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <FiLogOut className="text-gray-300 h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-300">Logout</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;