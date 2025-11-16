import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx'; // .jsx extension

// --- Public Pages ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SubmitReportPage from './pages/SubmitReportPage.jsx';
import TrackReportPage from './pages/TrackReportPage.jsx';
import ReportStatusPage from './pages/ReportStatusPage.jsx';

// --- Protected Route Guards ---
import AdminRoute from './protectedRoutes/AdminRoute.jsx';
import WorkerRoute from './protectedRoutes/WorkerRoute.jsx';

// --- Worker Pages ---
import WorkerDashboard from './pages/worker/WorkerDashboard.jsx';
import WorkerUpdatePage from './pages/worker/WorkerUpdatePage.jsx';
import WorkerProfile from './pages/worker/WorkerProfile.jsx';

// --- Admin Pages ---
import AdminLayout from './components/layout/AdminLayout.jsx'; // Import the layout
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminAllReports from './pages/admin/AdminAllReports.jsx';
import AdminAllWorkers from './pages/admin/AdminAllWorkers.jsx';
import AdminCreateWorker from './pages/admin/AdminCreateWorker.jsx';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/submit" element={<SubmitReportPage />} />
        <Route path="/track" element={<TrackReportPage />} />
        <Route path="/track/:reportId" element={<ReportStatusPage />} />
        
        {/* --- Worker Protected Routes --- */}
        <Route element={<WorkerRoute />}>
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/update/:reportId" element={<WorkerUpdatePage />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
        </Route>

        {/* --- Admin Protected Routes --- */}
        <Route element={<AdminRoute />}>
          {/* Sabhi admin routes ab AdminLayout ke andar render honge */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<AdminAllReports />} />
            <Route path="workers" element={<AdminAllWorkers />} />
            <Route path="create-worker" element={<AdminCreateWorker />} />
          </Route>
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;