import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FiDownload, FiFilter, FiCalendar, FiUser } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ActivityLog = () => {
  const { authState } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: null,
    endDate: null
  });

  const fetchLogs = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append('user_id', filters.userId);
      if (filters.action) queryParams.append('action', filters.action);
      if (filters.startDate) queryParams.append('start_date', filters.startDate.toISOString());
      if (filters.endDate) queryParams.append('end_date', filters.endDate.toISOString());

      const response = await fetch(`http://localhost:5000/api/admin/team/activity-logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch activity logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const exportLogs = () => {
    const csv = [
      ['Username', 'Action', 'Details', 'IP Address', 'Timestamp'],
      ...logs.map(log => [
        log.username,
        log.action,
        log.details,
        log.ip_address,
        new Date(log.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track all user activities and system changes
          </p>
        </div>
        <button
          onClick={exportLogs}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiDownload className="mr-2" /> Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters({...filters, userId: e.target.value})}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">All Users</option>
              {/* Add user options dynamically */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={filters.startDate}
              onChange={date => setFilters({...filters, startDate: date})}
              className="w-full rounded-md border-gray-300"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={filters.endDate}
              onChange={date => setFilters({...filters, endDate: date})}
              className="w-full rounded-md border-gray-300"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Details</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">IP Address</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{log.username}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{log.action}</td>
                      <td className="px-3 py-4 text-sm text-gray-900">{log.details}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{log.ip_address}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;