import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiMail, FiPieChart, FiBell } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalPosts: 0,
    totalServices: 0,
    totalProjects: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  
  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/activity');
      const data = await response.json();
      setRecentActivity(data);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600">Total Contacts</p>
              <h3 className="text-2xl font-bold">{stats.totalContacts}</h3>
            </div>
            <FiUsers className="text-blue-600 text-2xl" />
          </div>
        </div>
        {/* ... Similar stats cards ... */}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/blog" className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">Blog Management</h2>
          <p>Manage blog posts and categories</p>
        </Link>
        <Link to="/admin/services" className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">Services</h2>
          <p>Update service offerings</p>
        </Link>
        <Link to="/admin/portfolio" className="p-6 bg-white rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">Portfolio</h2>
          <p>Manage portfolio projects</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                <p>{activity.description}</p>
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            {/* Add notifications list */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;