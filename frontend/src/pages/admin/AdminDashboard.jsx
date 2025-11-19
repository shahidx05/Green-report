import React, { useState, useEffect } from 'react';
import { getAdminAllReports, getAdminAllWorkers } from '../../services/api.js';
import { motion } from 'framer-motion';
import { 
  FaListUl, 
  FaUsers, 
  FaCircleCheck,
  FaHourglassHalf,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa6";
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

// --- New Imports for Charts ---
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Enhanced Stat Card ---
const StatCard = ({ title, value, icon, bgColor, color, trend }) => (
  <motion.div
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
        {React.cloneElement(icon, { className: "h-6 w-6" })}
      </div>
    </div>
    {/* Fake trend data for visual appeal */}
    <div className="mt-4 flex items-center text-sm">
      {trend === 'up' ? (
        <span className="text-green-600 flex items-center font-medium bg-green-50 px-2 py-0.5 rounded-full">
          <FaArrowUp className="mr-1" size={10} /> 12.5%
        </span>
      ) : (
         <span className="text-red-500 flex items-center font-medium bg-red-50 px-2 py-0.5 rounded-full">
          <FaArrowDown className="mr-1" size={10} /> 2.1%
        </span>
      )}
      <span className="text-gray-400 ml-2">vs last month</span>
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
  const [chartData, setChartData] = useState([]); // Data for Line Chart
  const [pieData, setPieData] = useState([]);     // Data for Pie Chart
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

        // Calculate Stats
        const pending = reports.filter(r => r.status === 'Pending' || r.status === 'Assigned').length;
        const completed = reports.filter(r => r.status === 'Completed').length;
        const declined = reports.filter(r => r.status === 'Declined').length;

        setStats({
          totalReports: reports.length,
          pendingReports: pending,
          completedReports: completed,
          totalWorkers: workers.length,
        });

        // --- Prepare Pie Chart Data ---
        setPieData([
          { name: 'Pending', value: pending, color: '#EAB308' }, // Yellow
          { name: 'Completed', value: completed, color: '#22C55E' }, // Green
          { name: 'Declined', value: declined, color: '#EF4444' }, // Red
        ]);

        // --- Prepare Line Chart Data (Mocking timeline based on createdAt) ---
        // In a real app, you'd aggregate this on the backend.
        // Here we just grouping by date string for simplicity.
        const timeline = {};
        reports.forEach(r => {
            const date = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            timeline[date] = (timeline[date] || 0) + 1;
        });
        
        // Convert to array and sort (basic sort)
        const lineData = Object.keys(timeline).map(date => ({
            date,
            reports: timeline[date]
        })).slice(-7); // Last 7 days/entries

        setChartData(lineData);

      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading Dashboard..." className="min-h-[calc(100vh-200px)]" />;

  return (
    <div className="space-y-8">
      {/* 1. Top Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, here is what's happening in your city today.</p>
      </div>
      
      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reports" 
          value={stats.totalReports} 
          icon={<FaListUl />} 
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend="up"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingReports} 
          icon={<FaHourglassHalf />} 
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          trend="down" // Good if pending goes down
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completedReports} 
          icon={<FaCircleCheck />} 
          color="text-green-600"
          bgColor="bg-green-50"
          trend="up"
        />
        <StatCard 
          title="Active Workers" 
          value={stats.totalWorkers} 
          icon={<FaUsers />} 
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          trend="up"
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Chart: Activity Trends */}
        <motion.div 
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Report Activity (Last 7 Days)</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#15803d', fontWeight: 'bold' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="reports" 
                            stroke="#15803d" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#15803d', strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* Pie Chart: Status Distribution */}
        <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resolution Status</h3>
            <div className="h-64 w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                    <span className="font-bold text-gray-800">{stats.completedReports}</span> reports resolved so far.
                </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;