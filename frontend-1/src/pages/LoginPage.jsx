import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// FA6 icons
import { FaRecycle, FaSpinner } from 'react-icons/fa6';

// FA5 icons (because FA6 does NOT include this)
import { FaSignInAlt } from 'react-icons/fa';

import { Link, Navigate } from 'react-router-dom';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password.");
    }
    
    setIsLoading(true);
    const result = await auth.login(email, password);
    setIsLoading(false);

    if (result === true) {
      toast.success(`Welcome, ${auth.user?.name}!`);
    } else {
      // Show the error message from the backend
      toast.error(result); 
    }
  };

  // If user is already logged in, redirect them away from the login page
  if (auth.isLoggedIn) {
    if (auth.user?.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (auth.user?.role === 'Worker') {
      return <Navigate to="/worker/dashboard" replace />;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div 
        className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <FaRecycle className="h-16 w-16 text-primary-dark mx-auto animate-pulse" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Employee Login</h1>
          <p className="text-gray-600">Access your Admin or Worker panel.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 text-lg font-medium text-white bg-primary-dark rounded-lg shadow-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaSignInAlt className="mr-2" />
                )}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </motion.button>
            </div>
          </div>
        </form>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-primary-dark hover:text-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;