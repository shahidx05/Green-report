import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// FA6 icons (these exist)
import { FaChevronLeft } from "react-icons/fa6";

// FA5 icons (these DO NOT exist in FA6)
import {
  FaUserCircle,
  FaEnvelope,
  FaCity,
  FaListAlt
} from "react-icons/fa";
import Navbar from '../../components/layout/Navbar';

function WorkerProfile() {
  const { user } = useAuth(); // Get user data from context

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-4">
        {/* Back Button */}
        <Link to="/worker/dashboard" className="text-sm font-medium text-primary-dark hover:text-primary flex items-center mb-4">
          <FaChevronLeft className="mr-1" />
          Back to Dashboard
        </Link>
        
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center md:flex-row">
            <FaUserCircle className="h-24 w-24 md:h-32 md:w-32 text-gray-300" />
            <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-xl text-gray-600">{user.role}</p>
            </div>
          </div>
          
          <hr className="my-8" />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your Details</h2>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="flex items-center text-gray-700">
                <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                <strong>Email:</strong>&nbsp;{user.email}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="flex items-center text-gray-700">
                <FaCity className="h-5 w-5 text-gray-400 mr-3" />
                <strong>Assigned City:</strong>&nbsp;{user.city}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="flex items-center text-gray-700">
                <FaListAlt className="h-5 w-5 text-gray-400 mr-3" />
                <strong>Pending Tasks:</strong>&nbsp;{user.pendingTaskCount || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default WorkerProfile;