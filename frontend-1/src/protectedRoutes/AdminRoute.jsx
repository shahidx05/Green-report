import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx'; // .jsx extension
import { FaSpinner } from 'react-icons/fa6';

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <FaSpinner className="animate-spin text-primary text-4xl" />
  </div>
);

const AdminRoute = () => {
  const auth = useAuth();

  // 1. Agar auth context abhi load ho raha hai, toh spinner dikhayein
  if (auth.loading) {
    return <LoadingScreen />;
  }

  // 2. Agar user logged in hai AUR unka role 'Admin' hai, toh page dikhayein
  if (auth.isLoggedIn && auth.user?.role === 'Admin') {
    return <Outlet />; // Yeh aapke nested component (e.g., <AdminDashboard />) ko render karega
  }

  // 3. Agar user logged in nahi hai ya role galat hai, toh login page par redirect karein
  return <Navigate to="/login" replace />;
};

export default AdminRoute;