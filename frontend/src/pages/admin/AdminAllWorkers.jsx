import React, { useState, useEffect } from 'react';
import { getAdminAllWorkers } from '../../services/api.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEnvelope, FaCity, FaListCheck } from "react-icons/fa6";

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white rounded-xl shadow-lg ">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Manage workers</h1>
           <p className="text-gray-500 mt-1">Total Workforce: {workers.length}</p>
        </div>
        <Link to="/admin/create-worker">
          <button className="flex items-center px-6 py-3 bg-green-700 text-white font-bold rounded-xl shadow-lg hover:bg-green-800 hover:scale-105 transition-all">
            <FaUserPlus className="mr-2" /> Create New Worker
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker, index) => (
          <motion.div
            key={worker._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-md shadow-md border border-gray-100 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {worker.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                    ACTIVE
                  </span>
                </div>
              </div>
              <div className="text-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                 <span className="block text-2xl font-extrabold text-blue-600">{worker.pendingTaskCount}</span>
                 <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Tasks</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                <FaEnvelope className="text-gray-400 mr-3" /> {worker.email}
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                <FaCity className="text-gray-400 mr-3" /> {worker.city}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AdminAllWorkers;