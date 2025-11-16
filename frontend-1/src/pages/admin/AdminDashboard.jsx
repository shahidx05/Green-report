import React, { useState, useEffect } from 'react';
import { getAdminAllReports, getAdminAllWorkers } from '../../services/api';
import { motion } from 'framer-motion';

// ✅ These icons exist only in FontAwesome 5 (FA5)
import { 
  FaListAlt, 
  FaUsers, 
  FaCheckCircle, 
  FaHourglassHalf 
} from "react-icons/fa";

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    totalWorkers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [reportsRes, workersRes] = await Promise.all([
          getAdminAllReports(),
          getAdminAllWorkers()
        ]);

        const reports = reportsRes.data;
        const workers = workersRes.data;

        setStats({
          totalReports: reports.length,
          pendingReports: reports.filter(r => r.status === 'Pending' || r.status === 'Assigned').length,
          completedReports: reports.filter(r => r.status === 'Completed').length,
          totalWorkers: workers.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reports" 
          value={stats.totalReports} 
          icon={<FaListAlt className="h-6 w-6 text-blue-800" />} 
          color="bg-blue-100"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingReports} 
          icon={<FaHourglassHalf className="h-6 w-6 text-yellow-800" />} 
          color="bg-yellow-100"
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completedReports} 
          icon={<FaCheckCircle className="h-6 w-6 text-green-800" />} 
          color="bg-green-100"
        />
        <StatCard 
          title="Total Workers" 
          value={stats.totalWorkers} 
          icon={<FaUsers className="h-6 w-6 text-indigo-800" />} 
          color="bg-indigo-100"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
