import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { FiEdit, FiTrash2, FiImage, FiLink, FiEye, FiEyeOff } from 'react-icons/fi';

const PortfolioEditor = () => {
  const { authState } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('edit');
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    client: '',
    imageUrl: '',
    category: '',
    link: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/portfolio', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      setMessage({ type: 'error', text: 'Failed to fetch projects' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.token) {
      fetchProjects();
    }
  }, [authState.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5000/api/admin/portfolio${formData.id ? `/${formData.id}` : ''}`;
      const method = formData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
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
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
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
      category: '',
      link: ''
    });
    setIsEditing(false);
  };

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/portfolio/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ visible: !currentStatus })
      });

      if (response.ok) {
        setProjects(projects.map(project => 
          project.id === id ? { ...project, visible: !project.visible } : project
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
      const response = await fetch(`http://localhost:5000/api/admin/portfolio/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== deleteConfirm.id));
        setMessage({ type: 'success', text: 'Project deleted successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete project' });
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('edit')}
          className={`py-2 px-4 ${activeTab === 'edit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Edit Projects
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-2 px-4 ${activeTab === 'preview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Preview Gallery
        </button>
      </div>

      {activeTab === 'edit' ? (
        <>
          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Project Title"
                className="w-full p-2 border rounded"
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
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Project Description"
              className="w-full p-2 border rounded h-32"
              required
            />
            <div className="flex justify-end space-x-4">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {isEditing ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>

          {/* Projects List with Visibility Toggle */}
          <div className="mt-8 space-y-4">
            {projects.map(project => (
              <div key={project.id} className={`bg-white p-4 rounded-lg shadow-sm flex items-center justify-between ${!project.visible ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-4">
                  {project.imageUrl && (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleVisibility(project.id, project.visible)}
                    className={`p-2 ${project.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'} rounded`}
                    title={project.visible ? 'Hide Project' : 'Show Project'}
                  >
                    {project.visible ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm.show && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setDeleteConfirm({ show: false, id: null })}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Preview Gallery */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {project.imageUrl && (
                <div className="relative group">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-white rounded-full text-blue-600 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="text-sm text-blue-600 mb-2">{project.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 line-clamp-3">{project.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{project.client}</span>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiLink />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioEditor;