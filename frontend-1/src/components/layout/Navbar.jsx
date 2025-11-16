import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Icons: FA6 for most, FA5 for FaUserCircle
import {
  FaRecycle,
  FaArrowRightToBracket,
  FaBars,
  FaXmark,
  FaArrowRightFromBracket
} from "react-icons/fa6";

import { FaUserCircle } from "react-icons/fa";

// import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth'; // Auth hook
import toast from 'react-hot-toast';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth(); // Auth context se data lein
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (auth.user?.role === 'Admin') return '/admin/dashboard';
    if (auth.user?.role === 'Worker') return '/worker/dashboard';
    return '/';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Title */}
          <Link to="/" className="flex items-center space-x-2">
            <FaRecycle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              GreenReport
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            {auth.isLoggedIn ? (
              <>
                <Link 
                  to={getDashboardLink()}
                  className="text-gray-600 hover:text-primary font-medium"
                >
                  <FaUserCircle className="inline mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-dark rounded-lg hover:bg-primary focus:outline-none"
                >
                  <FaArrowRightFromBracket className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                {/* motion.button ko abhi ke liye comment kar diya hai kyonki import commented hai */}
                <button
                  // whileHover={{ scale: 1.05 }}
                  // whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-dark rounded-lg hover:bg-primary"
                >
                  <FaArrowRightToBracket className="inline mr-2" />
                  Employee Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 text-2xl">
              {isOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (simple toggle) */}
      <div className={`md:hidden overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-3">
          {auth.isLoggedIn ? (
            <>
              <Link to={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <FaUserCircle className="inline mr-2" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <FaArrowRightFromBracket className="inline mr-2" />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
              <FaArrowRightToBracket className="inline mr-2" />
              Employee Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
