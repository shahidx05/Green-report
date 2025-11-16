import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Fixed icons
import { FaChevronLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";


function TrackReportPage() {
  const [reportId, setReportId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (reportId.trim()) {
      navigate(`/track/${reportId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <FaSearch className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Track Your Report</h1>
          <p className="text-gray-600">Enter the Report ID you received after submission.</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="space-y-6">
            <div>
              <label htmlFor="reportId" className="block text-sm font-medium text-gray-700">
                Report ID
              </label>
              <input
                id="reportId"
                type="text"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                placeholder="e.g., 65b3a8f4c3a7d2e1..."
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <motion.button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 text-lg font-medium text-white bg-primary-dark rounded-lg shadow-lg hover:bg-primary focus:outline-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSearch className="mr-2" />
                Track
              </motion.button>
            </div>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm font-medium text-primary-dark hover:text-primary">
            <FaChevronLeft className="inline mr-1" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default TrackReportPage;