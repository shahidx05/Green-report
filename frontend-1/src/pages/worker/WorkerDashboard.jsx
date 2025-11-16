import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import {
  FaSpinner,
  FaCamera,
  FaChevronLeft,
  FaCheck
} from "react-icons/fa6";

// FA5 icons (NOT available in FA6)
import {
  FaTimes,
  FaExclamationTriangle,
  FaUserCircle,
  FaListAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import Navbar from '../../components/layout/Navbar';

function WorkerDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const fetchAssignedReports = async () => {
      try {
        setLoading(true);
        // /api/worker/assigned endpoint se reports fetch karein
        const response = await api.get('/worker/assigned');
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch assigned reports:", error);
        toast.error("Could not load your assigned tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedReports();
  }, []);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'High': return 'border-red-500 bg-red-50';
      case 'Medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {auth.user?.name}
          </h1>
          <Link to="/worker/profile" className="text-sm font-medium text-primary-dark hover:text-primary">
            <FaUserCircle className="inline mr-1" />
            My Profile
          </Link>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center mt-16">
            <FaSpinner className="animate-spin text-primary text-4xl" />
          </div>
        ) : reports.length === 0 ? (
          <motion.div 
            className="text-center p-8 bg-white rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaListAlt className="h-12 w-12 text-gray-400 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">No Assigned Tasks</h2>
            <p className="mt-2 text-gray-600">You are all caught up! New tasks will appear here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                className={`rounded-lg shadow-md overflow-hidden border-l-4 ${getSeverityClass(report.severity)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row">
                  <img src={report.imageUrl_before} alt="Report" className="w-full h-48 md:w-48 object-cover" />
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        report.severity === 'High' ? 'bg-red-100 text-red-800' :
                        report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <FaExclamationTriangle className="inline mr-1" />
                        {report.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 my-2">{report.description || 'No description'}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      {report.address || 'Address not found'}
                    </p>
                    <p className="text-sm text-gray-600">City: {report.city}</p>
                  </div>
                  <div className="p-4 flex-shrink-0 flex items-center">
                    <Link to={`/worker/update/${report._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full md:w-auto px-6 py-2 bg-primary-dark text-white font-medium rounded-md shadow hover:bg-primary"
                      >
                        Update Status
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkerDashboard;