import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createWorker } from '../../services/api.js'; //
import { FaSpinner, FaUserPlus } from 'react-icons/fa6';
import Button from '../../components/common/Button.jsx'; //
import Card from '../../components/common/Card.jsx'; //

function AdminCreateWorker() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', city: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.city) {
      return toast.error("All fields are required.");
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating worker...");

    try {
      await createWorker(formData);
      toast.dismiss(loadingToast);
      toast.success("Worker created successfully!");
      navigate('/admin/workers');
    } catch (error) {
      setLoading(false);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Failed to create worker.");
    }
  };

  return (
    // --- FIX: 'max-w-lg' (Wider) and removed 'mt-10' (No top margin) ---
    <Card className="max-w-lg mx-auto p-8 shadow-xl border border-gray-100 rounded-2xl bg-white">
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
          <FaUserPlus />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Register New Worker</h2>
        {/* <p className="text-gray-500 mt-1">Add a new member to the sanitation team.</p> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
          <input 
            id="name" 
            type="text" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 focus:bg-white transition-all" 
            placeholder="e.g. Rahul Kumar" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input 
            id="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 focus:bg-white transition-all" 
            placeholder="e.g. rahul@example.com" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            id="password" 
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 focus:bg-white transition-all" 
            placeholder="••••••••" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Assigned City</label>
          <input 
            id="city" 
            type="text" 
            value={formData.city} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 focus:bg-white transition-all" 
            placeholder="e.g. Gwalior" 
            required 
          />
        </div>
        <div className="pt-4">
          <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full py-3 text-lg shadow-lg">
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Create Account"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AdminCreateWorker;