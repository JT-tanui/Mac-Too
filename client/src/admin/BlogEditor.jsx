import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const BlogEditor = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    content: '',
    category: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:5000/api/admin/blog');
    const data = await response.json();
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5000/api/admin/blog${formData.id ? `/${formData.id}` : ''}`;
      const method = formData.id ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await fetch(`http://localhost:5000/api/admin/blog/${id}`, {
        method: 'DELETE'
      });
      fetchPosts();
    }
  };

  const handleEdit = (post) => {
    setFormData(post);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', content: '', category: '', imageUrl: '' });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Post' : 'Create Post'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Post Title"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder="Post Content"
            className="w-full p-2 border rounded h-32"
            required
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {isEditing ? 'Update Post' : 'Create Post'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-600 text-white rounded">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-gray-600">{post.category}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(post)} className="text-blue-600">
                    <FiEdit size={20} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600">
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

export default BlogEditor;