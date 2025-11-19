import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api.js'; 
import L from 'leaflet';
import toast from 'react-hot-toast';

// --- 1. Define Custom Icons ---
// We use external images for colored markers to keep it simple and reliable.
const createIcon = (colorUrl) => new L.Icon({
  iconUrl: colorUrl,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  pending: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'),
  assigned: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'),
  completed: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'),
  declined: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'),
  default: createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png')
};

function ReportMap() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Pending', 'Completed'
  const defaultPosition = [26.2183, 78.1828]; // Gwalior center

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/all'); 
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        toast.error('Could not load map reports.');
      }
    };
    fetchReports();
  }, []);

  // --- 2. Filter Logic ---
  const filteredReports = reports.filter(report => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return report.status === 'Pending' || report.status === 'Assigned';
    if (filter === 'Completed') return report.status === 'Completed';
    return true;
  });

  // Helper to select icon based on status
  const getIconForStatus = (status) => {
    switch (status) {
      case 'Pending': return icons.pending;
      case 'Assigned': return icons.assigned;
      case 'Completed': return icons.completed;
      case 'Declined': return icons.declined;
      default: return icons.default;
    }
  };

  // Helper for badge colors in popup
  const getBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return '#F59E0B'; // Orange
      case 'Assigned': return '#3B82F6'; // Blue
      case 'Completed': return '#10B981'; // Green
      default: return '#6B7280';
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Header & Filters --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0 text-center md:text-left">
             <h2 className="text-3xl font-bold text-gray-900">Live Impact Map</h2>
             <p className="text-gray-500 mt-1">See real-time reports and clean-up progress.</p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
             {['All', 'Pending', 'Completed'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                   filter === f 
                     ? 'bg-white text-green-700 shadow-sm' 
                     : 'text-gray-600 hover:text-gray-900'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>

        {/* --- Map Container --- */}
        <div className="h-[600px] w-full rounded-2xl shadow-xl overflow-hidden relative z-0 border border-gray-200">
          <MapContainer 
            center={defaultPosition} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {filteredReports.map((report) => (
              <Marker 
                key={report._id} 
                position={[report.location.lat, report.location.lng]}
                icon={getIconForStatus(report.status)} // --- Using Colored Icon Here ---
              >
                <Popup className="custom-popup">
                  <div className="w-56 p-1">
                    {/* Image with Status Badge */}
                    <div className="relative h-32 mb-2 rounded-md overflow-hidden bg-gray-100">
                       <img 
                         src={report.imageUrl_before} 
                         alt="Report" 
                         className="w-full h-full object-cover" 
                       />
                       <div 
                         className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white rounded-bl shadow-sm"
                         style={{ backgroundColor: getBadgeColor(report.status) }}
                       >
                         {report.status}
                       </div>
                    </div>
                    
                    {/* Text Info */}
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                      {report.description || "Waste Report"}
                    </h4>
                    <div className="flex justify-between items-end mt-1">
                        <p className="text-xs text-gray-500">
                          {report.city}
                        </p>
                        <span className="text-[10px] text-gray-400">
                           {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* --- Floating Legend --- */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg z-[500] text-xs border border-gray-100">
             <h5 className="font-bold text-gray-700 mb-2">Status Key</h5>
             <div className="flex items-center mb-2">
                <img src={icons.pending.options.iconUrl} className="w-4 h-6 mr-2" alt="" />
                <span>Pending</span>
             </div>
             <div className="flex items-center mb-2">
                <img src={icons.assigned.options.iconUrl} className="w-4 h-6 mr-2" alt="" />
                <span>Assigned</span>
             </div>
             <div className="flex items-center">
                <img src={icons.completed.options.iconUrl} className="w-4 h-6 mr-2" alt="" />
                <span>Completed</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ReportMap;