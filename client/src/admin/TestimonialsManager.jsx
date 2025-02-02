import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FiEdit, FiTrash2, FiCheck, FiX, FiImage } from 'react-icons/fi';

const TestimonialsManager = () => {
  const { authState } = useContext(AuthContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    author: '',
    role: '',
    company: '',
    content: '',
    imageUrl: '',
    rating: 5,
    status: 'pending' // pending, approved, rejected
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/testimonials', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/admin/testimonials/${formData.id}`
        : 'http://localhost:5000/api/admin/testimonials';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save testimonial');
      const savedTestimonial = await response.json();

      setTestimonials(prev => 
        isEditing 
          ? prev.map(t => t.id === savedTestimonial.id ? savedTestimonial : t)
          : [...prev, savedTestimonial]
      );

      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      author: '',
      role: '',
      company: '',
      content: '',
      imageUrl: '',
      rating: 5,
      status: 'pending'
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/testimonials/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update status');
      const updatedTestimonial = await response.json();
      setTestimonials(prev => 
        prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage client testimonials and reviews
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Testimonial
        </button>
      </div>

      {/* Grid of Testimonials */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.author}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{testimonial.author}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                testimonial.status === 'approved' ? 'bg-green-100 text-green-800' :
                testimonial.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {testimonial.status}
              </span>
            </div>
            <p className="mt-4 text-gray-600">{testimonial.content}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleStatusChange(testimonial.id, 'approved')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <FiX />
              </button>
              <button
                onClick={() => {
                  setFormData(testimonial);
                  setIsEditing(true);
                  setShowForm(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-lg font-medium mb-4">
              {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Add other form fields */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;