import React, { useEffect, useState } from 'react'; // --- UPDATED ---
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Imports FIXED --- 
import { useAuth } from '../../hooks/useAuth.jsx'; 
import { getMe } from '../../services/api.js'; // --- NEW IMPORT ---
import Navbar from '../../components/layout/Navbar.jsx'; 
import Card from '../../components/common/Card.jsx'; 

import { 
  FaChevronLeft,
  FaEnvelope,
  FaCity,
  FaListUl,
  FaCircleUser 
} from "react-icons/fa6";

function WorkerProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(user); // Local state for fresh data

  // --- NEW: Fetch fresh data on mount ---
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const response = await getMe(); // Calls /api/auth/me
        setProfileData(response.data); // Update local state with fresh DB data
      } catch (error) {
        console.error("Failed to refresh profile data", error);
      }
    };

    fetchFreshData();
  }, []);

  // Fallback if user is null (shouldn't happen in protected route)
  if (!profileData) {
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
        <Link 
          to="/worker/dashboard" 
          className="text-sm font-medium text-green-700 hover:text-green-600 flex items-center mb-4"
        >
          <FaChevronLeft className="mr-1" />
          Back to Dashboard
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            {/* Profile Header */}
            <div className="flex flex-col items-center md:flex-row">
              <FaCircleUser className="h-24 w-24 md:h-32 md:w-32 text-gray-300" />
              <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
                {/* Use profileData instead of user */}
                <h1 className="text-4xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-xl text-gray-600">{profileData.role}</p>
              </div>
            </div>

            <hr className="my-8" />

            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Your Details</h2>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="flex items-center text-gray-700">
                  <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                  {/* Use profileData */}
                  <strong>Email:</strong>&nbsp;{profileData.email}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="flex items-center text-gray-700">
                  <FaCity className="h-5 w-5 text-gray-400 mr-3" />
                  {/* Use profileData */}
                  <strong>Assigned City:</strong>&nbsp;{profileData.city}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="flex items-center text-gray-700">
                  <FaListUl className="h-5 w-5 text-gray-400 mr-3" />
                  <strong>Pending Tasks:</strong>&nbsp;
                  {/* This will now show the FRESH count from the DB */}
                  {profileData.pendingTaskCount || 0}
                </p>
              </div>

            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default WorkerProfile;