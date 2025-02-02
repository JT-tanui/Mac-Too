import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FiMail, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const ContactMessages = () => {
  const { authState } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, read, unread

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/contacts/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        ));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'read') return msg.read;
    if (filter === 'unread') return !msg.read;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage incoming contact form messages
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-4 sm:mt-0 rounded-md border-gray-300"
        >
          <option value="all">All Messages</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMessages.map(message => (
            <li key={message.id}>
              <div className={`px-4 py-4 sm:px-6 ${!message.read ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {message.email}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <FiMail />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{selectedMessage.name}</h3>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <FiX />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Close
              </button>
              {!selectedMessage.read && (
                <button
                  onClick={() => {
                    markAsRead(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;