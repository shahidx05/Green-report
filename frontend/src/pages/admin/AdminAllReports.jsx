import React, { useState, useEffect } from 'react';
import { getAdminAllReports, adminUpdateReport, getAdminAllWorkers } from '../../services/api.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Modal from '../../components/common/Modal.jsx'; 
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

import { 
  FaSearch, 
  FaFilter, 
  FaBan, 
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEye
} from 'react-icons/fa'; // Using 'fa' for consistency

import { 
  FaUserGear, 
} from 'react-icons/fa6'; // Using 'fa' for consistency



function AdminAllReports() {
  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [reportsRes, workersRes] = await Promise.all([
          getAdminAllReports(),
          getAdminAllWorkers()
        ]);
        setReports(reportsRes.data);
        setWorkers(workersRes.data);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Filter Logic
  const filteredReports = reports.filter(report => {
    const matchesStatus = filter === 'All' || report.status === filter;
    const matchesSearch = 
      report.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report._id.includes(searchTerm) ||
      (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // 3. Handle Actions (Assign / Decline / Complete)
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedReport) return;

    // Validation for Assignment
    if (newStatus === 'Assigned' && !selectedWorkerId) {
        return toast.error("Please select a worker first.");
    }

    setIsUpdating(true);
    const loadingToast = toast.loading("Updating report...");

    try {
      const updateData = { status: newStatus };
      if (newStatus === 'Assigned') {
        updateData.workerId = selectedWorkerId;
      }

      const response = await adminUpdateReport(selectedReport._id, updateData);
      const updatedReport = response.data.report;

      // Backend might send ID only, so we repopulate manually for UI
      if (newStatus === 'Assigned' && !updatedReport.assignedWorker.name) {
         const workerObj = workers.find(w => w._id === selectedWorkerId);
         updatedReport.assignedWorker = workerObj;
      }

      // Update Local State
      setReports(reports.map(r => r._id === selectedReport._id ? updatedReport : r));
      
      toast.dismiss(loadingToast);
      toast.success(`Report marked as ${newStatus}`);
      setSelectedReport(null); // Close Modal

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to open modal
  const openManageModal = (report) => {
    setSelectedReport(report);
    // Pre-select current worker if assigned
    setSelectedWorkerId(report.assignedWorker ? report.assignedWorker._id : '');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Reports <span className="text-gray-500 text-lg">({filteredReports.length})</span>
        </h2>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search by address, ID, desc..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100">
        {['All', 'Pending', 'Assigned', 'Completed', 'Declined'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === status 
                ? 'bg-green-700 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Report Details</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Worker</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Image & Desc */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={report.imageUrl_before} alt="Evidence" className="h-12 w-12 rounded-lg object-cover shadow-sm" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 w-48 truncate" title={report.description}>
                            {report.description || "No description"}
                        </div>
                        <div className="text-xs text-gray-500">ID: {report._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{report.city}</div>
                    <div className="text-xs text-gray-500 truncate w-32">{report.address}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>

                  {/* Assigned Worker */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.assignedWorker ? (
                        <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-2">
                                {report.assignedWorker.name.charAt(0)}
                            </div>
                            {report.assignedWorker.name}
                        </div>
                    ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Action Button */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => openManageModal(report)}
                        className="text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors flex items-center ml-auto"
                    >
                        <FaUserGear className="mr-1.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        No reports found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MANAGEMENT MODAL --- */}
      {selectedReport && (
        <Modal
            isOpen={!!selectedReport}
            onClose={() => setSelectedReport(null)}
            title={`Manage Report #${selectedReport._id.slice(-6)}`}
        >
            <div className="space-y-6">
                {/* Report Info */}
                <div className="flex gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <img src={selectedReport.imageUrl_before} className="w-24 h-24 object-cover rounded-md" alt="Report" />
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1 flex items-center"><FaMapMarkerAlt className="mr-1"/> {selectedReport.city}</p>
                        <p className="font-medium text-gray-800 text-sm mb-2">{selectedReport.description}</p>
                        <div className="flex gap-2">
                             <span className="text-xs font-bold px-2 py-1 bg-gray-200 rounded text-gray-700">Severity: {selectedReport.severity}</span>
                        </div>
                    </div>
                </div>

                {/* Assignment Section */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Assign Worker</label>
                    <select
                        value={selectedWorkerId}
                        onChange={(e) => setSelectedWorkerId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                    >
                        <option value="">-- Select a Worker --</option>
                        {/* Only show relevant workers */}
                        {workers.map(worker => (
                            <option key={worker._id} value={worker._id}>
                                {worker.name} ({worker.city}) - {worker.pendingTaskCount} Tasks
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Assigning a worker will automatically set status to <span className="font-semibold text-blue-600">Assigned</span>.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* ASSIGN BUTTON */}
                    <Button 
                        variant="primary" 
                        onClick={() => handleUpdateStatus('Assigned')}
                        disabled={isUpdating || !selectedWorkerId}
                        className="col-span-2"
                    >
                        {isUpdating ? <FaSearch className="animate-spin inline mr-2"/> : <FaUserGear className="inline mr-2"/>}
                        {selectedReport.assignedWorker ? "Re-Assign Worker" : "Assign Worker"}
                    </Button>

                    {/* DECLINE BUTTON */}
                    <Button 
                        variant="danger" 
                        onClick={() => handleUpdateStatus('Declined')}
                        disabled={isUpdating}
                    >
                        <FaBan className="inline mr-2"/> Decline Report
                    </Button>

                    {/* COMPLETE BUTTON (Admin Override) */}
                    <Button 
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => handleUpdateStatus('Completed')}
                        disabled={isUpdating}
                    >
                        <FaCheckCircle className="inline mr-2"/> Mark Completed
                    </Button>
                </div>
            </div>
        </Modal>
      )}

    </div>
  );
}

export default AdminAllReports;