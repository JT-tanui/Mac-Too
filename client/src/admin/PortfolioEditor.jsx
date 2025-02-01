import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { FiEdit, FiTrash2, FiImage } from 'react-icons/fi';

const PortfolioEditor = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    client: '',
    imageUrl: '',
    category: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/portfolio');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch projects' });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5000/api/admin/portfolio${formData.id ? `/${formData.id}` : ''}`;
      const method = formData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save project');

      fetchProjects();
      resetForm();
      setMessage({ 
        type: 'success', 
        text: `Project ${formData.id ? 'updated' : 'created'} successfully` 
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/portfolio/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete project');

        fetchProjects();
        setMessage({ type: 'success', text: 'Project deleted successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }
  };

  const handleEdit = (project) => {
    setFormData(project);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({ 
      id: null, 
      title: '', 
      description: '', 
      client: '', 
      imageUrl: '',
      category: '' 
    });
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {message.text && (
          <div className={`p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Project' : 'Add Project'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Project Title"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Project Description"
            className="w-full p-2 border rounded h-32"
            required
          />
          <input
            type="text"
            value={formData.client}
            onChange={(e) => setFormData({...formData, client: e.target.value})}
            placeholder="Client Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="Category"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            placeholder="Image URL"
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {isEditing ? 'Update Project' : 'Add Project'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-4 rounded-lg shadow">
              {project.imageUrl && (
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-gray-600">{project.client}</p>
                  <p className="text-sm text-gray-500">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-800">
                    <FiEdit size={20} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-800">
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

export default PortfolioEditor;