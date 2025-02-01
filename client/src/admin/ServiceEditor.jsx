import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ServiceEditor = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    icon: '',
    price: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchServices = async () => {
    const response = await fetch('http://localhost:5000/api/admin/services');
    const data = await response.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
    setFormData({ id: null, title: '', description: '', icon: '', price: '' });
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Service' : 'Add Service'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Service Title"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Service Description"
            className="w-full p-2 border rounded h-32"
            required
          />
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({...formData, icon: e.target.value})}
            placeholder="Icon (CSS class or URL)"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="Price Range"
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {isEditing ? 'Update Service' : 'Add Service'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-600 text-white rounded">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {services.map(service => (
            <div key={service.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-gray-600">{service.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(service)} className="text-blue-600">
                    <FiEdit size={20} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServiceEditor;