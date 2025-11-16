import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';

// ✅ Correct FA5 imports — these icons DO NOT exist in FA6
import {
  FaChartPie,
  FaListAlt,
  FaUsers,
  FaUserPlus
} from "react-icons/fa";

// Sidebar link component
const AdminNavLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center px-4 py-3 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-primary-dark text-white'
          : 'text-gray-700 hover:bg-gray-200'
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-lg space-y-2">

              <AdminNavLink 
                to="/admin/dashboard" 
                icon={<FaChartPie className="mr-3" />}
              >
                Dashboard
              </AdminNavLink>

              <AdminNavLink 
                to="/admin/reports" 
                icon={<FaListAlt className="mr-3" />}
              >
                All Reports
              </AdminNavLink>

              <AdminNavLink 
                to="/admin/workers" 
                icon={<FaUsers className="mr-3" />}
              >
                Manage Workers
              </AdminNavLink>

              <AdminNavLink 
                to="/admin/create-worker" 
                icon={<FaUserPlus className="mr-3" />}
              >
                Create Worker
              </AdminNavLink>

            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
