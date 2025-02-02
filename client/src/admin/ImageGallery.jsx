import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FiUpload, FiTrash2, FiLink, FiSearch, FiImage } from 'react-icons/fi';

const ImageGallery = () => {
  const { authState } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, used, unused
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/images', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/admin/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      const newImage = await response.json();
      setImages([newImage, ...images]);
      setUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredImages = images.filter(image => {
    if (searchTerm && !image.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filter === 'used' && !image.usedIn) return false;
    if (filter === 'unused' && image.usedIn) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track all images used across the website
          </p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiUpload className="mr-2" /> Upload Image
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-md border-gray-300"
          >
            <option value="all">All Images</option>
            <option value="used">Used Images</option>
            <option value="unused">Unused Images</option>
          </select>
        </div>
      </div>

      {/* Image Grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map(image => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={image.url}
                alt={image.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{image.name}</h3>
              {image.usedIn && (
                <p className="text-sm text-gray-500 mt-1">
                  Used in: {image.usedIn}
                </p>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(image.url)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <FiLink />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Upload Image</h3>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;