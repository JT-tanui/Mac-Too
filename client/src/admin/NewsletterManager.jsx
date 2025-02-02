import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FiMail, FiSend, FiUsers, FiEdit, FiTrash2 } from 'react-icons/fi';

const NewsletterManager = () => {
  const { authState } = useContext(AuthContext);
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsletters();
    fetchSubscribers();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/newsletters', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch newsletters');
      const data = await response.json();
      setNewsletters(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/newsletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create newsletter');
      const data = await response.json();
      setNewsletters([...newsletters, data]);
      setShowForm(false);
      setFormData({ title: '', subject: '', content: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSend = async (id) => {
    if (!window.confirm('Are you sure you want to send this newsletter?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/newsletters/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to send newsletter');
      fetchNewsletters();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and send newsletters to {subscribers.length} subscribers
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiMail className="mr-2" /> New Newsletter
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Save Newsletter
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {newsletters.map(newsletter => (
            <li key={newsletter.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{newsletter.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{newsletter.subject}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!newsletter.sent_at && (
                      <>
                        <button
                          onClick={() => handleSend(newsletter.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          <FiSend />
                        </button>
                        <button
                          onClick={() => {/* handle edit */}}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                        >
                          <FiEdit />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{newsletter.content}</p>
                </div>
                {newsletter.sent_at && (
                  <div className="mt-2 text-sm text-gray-500">
                    Sent on {new Date(newsletter.sent_at).toLocaleString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsletterManager;