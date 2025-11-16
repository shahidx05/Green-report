import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FaSpinner,
  FaHourglassHalf,
  FaChevronLeft
} from "react-icons/fa6";

// FA5 Icons (all missing in fa6)
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCity,
  FaExclamationTriangle,
  FaImage,
  FaCommentAlt,
  FaUserCog
} from "react-icons/fa";
// Loading component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <FaSpinner className="animate-spin text-primary text-4xl" />
    <p className="mt-4 text-gray-600">Loading Report Details...</p>
  </div>
);

// Error component
const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-64 p-4 bg-red-50 rounded-lg">
    <FaTimesCircle className="text-red-500 text-4xl" />
    <p className="mt-4 text-red-700 font-medium text-center">{message}</p>
    <Link to="/track" className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm">
      Try again
    </Link>
  </div>
);

// Status bar component
const StatusTracker = ({ status }) => {
  const statuses = [
    { name: 'Pending', icon: <FaHourglassHalf /> },
    { name: 'Assigned', icon: <FaUserCog /> },
    { name: 'Completed', icon: <FaCheckCircle /> },
  ];
  
  const getStatusIndex = (s) => {
    if (s === 'Declined') return -1;
    return statuses.findIndex(item => item.name === s);
  };

  const currentStatusIndex = getStatusIndex(status);

  if (currentStatusIndex === -1) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
        <div className="flex items-center">
          <FaTimesCircle className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <h3 className="text-lg font-bold text-red-700">Report Declined</h3>
            <p className="text-gray-600">This report was marked as declined.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {statuses.map((item, index) => (
          <React.Fragment key={item.name}>
            <div className="flex-1 text-center">
              <div className={`mx-auto h-10 w-10 rounded-full flex items-center justify-center ${
                index <= currentStatusIndex ? 'bg-primary' : 'bg-gray-300'
              }`}>
                <span className="text-white text-xl">{item.icon}</span>
              </div>
              <p className={`mt-2 font-medium ${
                index <= currentStatusIndex ? 'text-primary-dark' : 'text-gray-500'
              }`}>
                {item.name}
              </p>
            </div>
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-1 ${
                index < currentStatusIndex ? 'bg-primary' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Main component
function ReportStatusPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { reportId } = useParams(); // Get ID from URL

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;
      setLoading(true);
      setError(null);
      try {
        // Backend se /api/reports/track/:id call karein
        const response = await api.get(`/reports/track/${reportId}`);
        setReport(response.data);
      } catch (err) {
        console.error("Fetch report error:", err);
        setError(err.response?.data?.message || "Report not found.");
        toast.error("Report not found or invalid ID.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
          <Link to="/track" className="text-gray-600 hover:text-primary">
            <FaChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 ml-4">
            Report Status
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : report && (
            <div className="space-y-6">
              {/* --- Status Tracker --- */}
              <div>
                <h2 className="text-2xl font-bold text-center mb-6">Your Report's Progress</h2>
                <StatusTracker status={report.status} />
              </div>

              <hr />

              {/* --- Report Details --- */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Report Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Severity: <strong className="font-medium">{report.severity}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <FaCity className="h-5 w-5 text-gray-500 mr-3" />
                    <span>City: <strong className="font-medium">{report.city}</strong></span>
                  </div>
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Address: <strong className="font-medium">{report.address || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              {/* --- Worker Details --- */}
              {report.assignedWorker && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Assigned Worker</h3>
                  <div className="flex items-center">
                    <FaUserCog className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Name: <strong className="font-medium">{report.assignedWorker.name}</strong></span>
                  </div>
                </div>
              )}

              {/* --- Worker Notes --- */}
              {(report.status === 'Completed' || report.status === 'Declined') && report.workerNotes && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Worker's Note</h3>
                  <div className="flex">
                    <FaCommentAlt className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <p className="italic text-gray-700">"{report.workerNotes}"</p>
                  </div>
                </div>
              )}

              {/* --- Before & After Images --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Before (Your Photo)</h4>
                  <img src={report.imageUrl_before} alt="Before" className="w-full h-auto rounded-lg shadow-md" />
                </div>
                {report.imageUrl_after ? (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">After (Cleaned)</h4>
                    <img src={report.imageUrl_after} alt="After" className="w-full h-auto rounded-lg shadow-md" />
                  </div>
                ) : (
                  report.status !== 'Pending' && (
                    <div className="flex items-center justify-center h-full p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Awaiting "After" Photo...</p>
                    </div>
                  )
                )}
              </div>

            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default ReportStatusPage;