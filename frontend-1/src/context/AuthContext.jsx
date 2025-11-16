import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api.js'; // Use .js extension
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Will hold user object { name, role, ... }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Is the app still checking login?
  const navigate = useNavigate();

  // On app load, check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false); // Done checking
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // 1. Call your backend's /api/auth/login endpoint
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // 2. Get token and user from the response
      const { token, user } = response.data;

      // 3. Save to state and localStorage
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 4. Navigate to the correct dashboard
      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Worker') {
        navigate('/worker/dashboard');
      }

      return true; // Return success
    } catch (error) {
      console.error("Login failed:", error);
      // Return the error message from the backend
      return error.response?.data?.message || "Login failed. Please try again.";
    }
  };

  // Logout function
  const logout = () => {
    // 1. Clear state
    setUser(null);
    setToken(null);

    // 2. Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 3. Navigate to home
    navigate('/');
  };

  // The value provided to all children
  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn: !!user, // A simple boolean for "are we logged in?"
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;