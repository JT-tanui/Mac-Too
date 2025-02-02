import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './components/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';

const ServiceEditor = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const { authState } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    icon: '',
    price: '',
    visible: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/services', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.token) {
      fetchServices();
    }
  }, [authState.token]);

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/services/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ visible: !currentStatus })
      });
      if (response.ok) {
        setServices(services.map(service => 
          service.id === id ? { ...service, visible: !service.visible } : service
        ));
        setMessage({ type: 'success', text: 'Visibility updated successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update visibility' });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/services/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (response.ok) {
        setServices(services.filter(service => service.id !== deleteConfirm.id));
        setMessage({ type: 'success', text: 'Service deleted successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete service' });
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5000/api/admin/services${formData.id ? `/${formData.id}` : ''}`;
      const method = formData.id ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      fetchServices();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await fetch(`http://localhost:5000/api/admin/services/${id}`, {
        method: 'DELETE'
      });
      fetchServices();
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', description: '', icon: '', price: '', visible: true });
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('edit')}
            className={`${
              activeTab === 'edit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Manage Services
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Preview Services
          </button>
        </nav>
      </div>

      {activeTab === 'edit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Name
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'Update Service' : 'Add Service'}
              </button>
            </form>
          </div>

          {/* Services List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">All Services</h2>
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} 
                     className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                      <p className="text-blue-600 font-medium mt-2">{service.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVisibility(service.id, service.visible)}
                        className={`p-2 rounded-full ${
                          service.visible 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {service.visible ? <FiEye /> : <FiEyeOff />}
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 mb-4">
                <i className={`fas fa-${service.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-medium mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-lg font-semibold text-blue-600">{service.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete Service</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceEditor;