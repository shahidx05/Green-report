import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api'; // Central API file
import L from 'leaflet';
import toast from 'react-hot-toast';

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ReportMap() {
  const [reports, setReports] = useState([]);
  const defaultPosition = [26.2183, 78.1828]; // Gwalior

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Backend se public reports fetch karein
        const response = await api.get('/reports/all'); 
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        toast.error('Could not load map reports.');
      }
    };

    fetchReports();
  }, []);

  const getMarkerColor = (status) => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'Assigned': return 'blue';
      case 'Completed': return 'green';
      default: return 'grey';
    }
  };

  return (
    <section className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Live Waste Report Map
      </h2>
      <div className="h-[500px] w-full rounded-lg shadow-2xl overflow-hidden z-0">
        <MapContainer 
          center={defaultPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {reports.map((report) => (
            <Marker 
              key={report._id} 
              position={[report.location.lat, report.location.lng]}
            >
              <Popup>
                <div className="w-48">
                  <h4 className="font-bold">{report.description || "Report"}</h4>
                  <p>Status: 
                    <span style={{ color: getMarkerColor(report.status), fontWeight: 'bold' }}>
                      {report.status}
                    </span>
                  </p>
                  <img src={report.imageUrl_before} alt="Report" className="w-full h-auto rounded mt-2" />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default ReportMap;