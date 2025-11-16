import React, { useState, useEffect } from 'react';
import { getAdminAllWorkers } from '../../services/api';
import toast from 'react-hot-toast';
// FA6 (exists)
import { FaSpinner } from "react-icons/fa6";

// FA5 (these do NOT exist in FA6)
import { FaUserCircle, FaEnvelope, FaCity, FaListAlt } from "react-icons/fa";

import { Link } from 'react-router-dom';

function AdminAllWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setLoading(true);
        const response = await getAdminAllWorkers();
        setWorkers(response.data);
      } catch (error) {
        toast.error("Failed to load workers.");
      } finally {
        setLoading(false);
      }
    };
    loadWorkers();
  }, []);

  if (loading) return <FaSpinner className="animate-spin text-primary text-2xl" />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Workers ({workers.length})</h2>
        <Link 
          to="/admin/create-worker" 
          className="px-4 py-2 bg-primary-dark text-white text-sm font-medium rounded-md hover:bg-primary"
        >
          + Create New Worker
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending Tasks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.map(worker => (
              <tr key={worker._id}>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{worker.name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{worker.email}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{worker.city}</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-900 text-center">{worker.pendingTaskCount}</td>
                <td className="px-4 py-4 text-sm">
                  {worker.isActive ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAllWorkers;