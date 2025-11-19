import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx'; 
import Button from '../common/Button.jsx';
import toast from 'react-hot-toast';
import { adminUpdateReport } from '../../services/api.js';
import { 
  FaCheck,
  FaBan,
  FaUserGear,
  FaSpinner
} from 'react-icons/fa6';
import { 
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCalendarAlt
} from 'react-icons/fa';

function ReportManagementModal({ report, isOpen, onClose, workers, onUpdate }) {
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (report) {
      setSelectedWorkerId(report.assignedWorker ? report.assignedWorker._id : '');
    }
  }, [report]);

  const handleAction = async (actionType) => {
    if (actionType === 'Assign' && !selectedWorkerId) {
      return toast.error("Please select a worker to assign.");
    }

    setIsUpdating(true);
    const loadingToast = toast.loading("Updating report...");

    try {
      let updateData = {};

      if (actionType === 'Assign') {
        updateData = { status: 'Assigned', workerId: selectedWorkerId };
      } else if (actionType === 'Decline') {
        updateData = { status: 'Declined' };
      } else if (actionType === 'Complete') {
        updateData = { status: 'Completed' };
      }

      const response = await adminUpdateReport(report._id, updateData);
      
      toast.dismiss(loadingToast);
      toast.success(`Success: Report ${actionType === 'Assign' ? 'Assigned' : actionType + 'd'}`);
      
      onUpdate(response.data.report); 
      onClose();

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!report) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Report #${report._id.slice(-6)}`} size="xl">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Big Image */}
        <div className="space-y-4">
           <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner bg-gray-50 h-80 lg:h-full min-h-[300px]">
             <img 
               src={report.imageUrl_before} 
               alt="Report Evidence" 
               className="absolute inset-0 w-full h-full object-contain"
             />
           </div>
           
           <div className={`flex items-center justify-center p-3 rounded-xl font-bold text-lg ${
              report.severity === 'High' ? 'bg-red-50 text-red-600' :
              report.severity === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
              'bg-green-50 text-green-700'
            }`}>
              <FaExclamationTriangle className="mr-2" /> {report.severity} Severity
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Location</h3>
                    <p className="text-xl font-bold text-gray-800 flex items-start mt-1">
                       <FaMapMarkerAlt className="mt-1.5 mr-2 text-green-600 flex-shrink-0" />
                       {report.address || report.city}
                    </p>
                    <p className="text-gray-500 text-sm ml-7">{report.city}</p>
                </div>

                <div>
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-1">
                       <p className="text-gray-700 italic">"{report.description}"</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Reported On</h3>
                    <p className="text-gray-800 flex items-center mt-1">
                        <FaCalendarAlt className="mr-2 text-gray-400" /> 
                        {new Date(report.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="bg-white border-t-2 border-gray-100 pt-6 mt-4">
               <h3 className="text-lg font-bold text-gray-900 mb-4">Take Action</h3>
               
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign a Worker</label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                       <select
                        value={selectedWorkerId}
                        onChange={(e) => setSelectedWorkerId(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white"
                        disabled={report.status === 'Completed' || report.status === 'Declined'}
                       >
                        <option value="">Select a Worker...</option>
                        {workers.map(worker => (
                            <option key={worker._id} value={worker._id}>
                                {worker.name} — {worker.pendingTaskCount} Active Tasks
                            </option>
                        ))}
                       </select>
                       <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                          <FaUserGear />
                       </div>
                    </div>
                    <Button 
                        onClick={() => handleAction('Assign')}
                        disabled={isUpdating || !selectedWorkerId}
                        className="whitespace-nowrap"
                    >
                        {isUpdating ? <FaSpinner className="animate-spin" /> : "Assign"}
                    </Button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button
                     onClick={() => handleAction('Decline')}
                     disabled={isUpdating || report.status === 'Declined'}
                     className="flex items-center justify-center py-3 px-4 rounded-xl border-2 border-red-100 text-red-600 font-bold hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50"
                  >
                     <FaBan className="mr-2" /> Decline Report
                  </button>

                  <button
                     onClick={() => handleAction('Complete')}
                     disabled={isUpdating || report.status === 'Completed'}
                     className="flex items-center justify-center py-3 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                     <FaCheck className="mr-2" /> Mark Completed
                  </button>
               </div>

            </div>
        </div>

      </div>
    </Modal>
  );
}

export default ReportManagementModal;