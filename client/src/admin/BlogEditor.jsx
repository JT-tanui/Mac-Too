import React, { useState, useEffect, useContext } from 'react';
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import { AuthContext } from '../contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';

const BlogEditor = () => {
  const { authState } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('edit');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    content: '',
    category: '',
    imageUrl: '',
    visible: true
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/blog', {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        });
        if (!isMounted) return;
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching posts:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };
  
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  const toggleVisibility = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/blog/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ visible: !currentStatus })
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === id ? { ...post, visible: !post.visible } : post
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
      const response = await fetch(`http://localhost:5000/api/admin/blog/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== deleteConfirm.id));
        setMessage({ type: 'success', text: 'Post deleted successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete post' });
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleEdit = (post) => {
    setFormData({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      visible: post.visible
    });
    setIsEditing(true);
    setActiveTab('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/admin/blog/${formData.id}`
        : 'http://localhost:5000/api/admin/blog';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save post');
      }

      const data = await response.json();
      if (isEditing) {
        setPosts(posts.map(post => post.id === data.id ? data : post));
      } else {
        setPosts([...posts, data]);
      }
      setFormData({ id: null, title: '', content: '', category: '', imageUrl: '', visible: true });
      setIsEditing(false);
      setMessage({ type: 'success', text: `Post ${isEditing ? 'updated' : 'created'} successfully` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', content: '', category: '', imageUrl: '', visible: true });
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const MessageAlert = ({ message }) => {
    if (!message.text) return null;
    
    const bgColor = message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    
    return (
      <div className={`p-4 rounded-md ${bgColor} mb-4`}>
        {message.text}
      </div>
    );
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
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
              Manage Posts
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              Preview Posts
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 p-4">{error}</div>
        ) : activeTab === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-6">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows="6"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Update Post' : 'Create Post'}
                </button>
              </form>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-6">All Posts</h2>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-gray-500">{post.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleVisibility(post.id, post.visible)}
                        className={`p-2 rounded-full ${post.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      >
                        {post.visible ? <FiEye /> : <FiEyeOff />}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">{post.category}</div>
                  <h3 className="text-xl font-medium mb-2">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">Delete Post</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
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

export default function BlogEditorWithErrorBoundary() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <BlogEditor />
    </ErrorBoundary>
  );
}