import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiMail, FiFileText, FiBriefcase, FiFolder, FiActivity } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';
import AdminErrorBoundary from '../components/AdminErrorBoundary';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalPosts: 0,
    totalServices: 0,
    totalProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = process.env.NODE_ENV === 'production' 
    ? '/.netlify/functions/api'
    : 'http://localhost:5000/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      fetchData();
    }
  }, [authState.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-20 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalContacts}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiMail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blog Posts</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPosts}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiFileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalServices}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiBriefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalProjects}</h3>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiFolder className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/blog" 
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <FiFileText className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Manage Blog</h3>
              <p className="text-gray-600 mt-1">Add or edit blog posts</p>
            </Link>
            <Link to="/admin/services"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <FiBriefcase className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Services</h3>
              <p className="text-gray-600 mt-1">Update service offerings</p>
            </Link>
            <Link to="/admin/portfolio"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <FiFolder className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Portfolio</h3>
              <p className="text-gray-600 mt-1">Manage portfolio items</p>
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-center">
                      <FiActivity className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 p-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;