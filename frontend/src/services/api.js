import axios from 'axios';

// Create a central 'api' client
let baseURL = "";

if (window.location.hostname === "localhost") {
  baseURL = "http://localhost:5000/api";  // Local backend
} else {
  baseURL = "https://green-report.onrender.com//api"; // Deploy backend
}

const api = axios.create({
  baseURL,
});

/*
  Yeh "request interceptor" hai.
  Yeh aapke har API request ke saath aapka auth token (localStorage se)
  automatically add kar dega.
*/
api.interceptors.request.use(
  (config) => {
    // Local storage se token lein
    const token = localStorage.getItem('token');
    
    // Agar token hai, toh usse Authorization header mein add karein
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Request error ko handle karein
    return Promise.reject(error);
  }
);

export default api;

// --- PUBLIC (CITIZEN) API CALLS ---
export const getPublicReports = () => api.get('/reports/all');
export const getReportById = (reportId) => api.get(`/reports/track/${reportId}`);
export const createReport = (formData) => api.post('/reports/create', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// --- AUTH API CALLS ---
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');

// --- WORKER API CALLS ---
export const getWorkerReports = () => api.get('/worker/reports');
export const updateWorkerReport = (reportId, formData) => api.put(`/worker/update/${reportId}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// --- ADMIN API CALLS ---
export const getAdminAllReports = () => api.get('/admin/reports');
export const getAdminAllWorkers = () => api.get('/admin/workers');
export const createWorker = (workerData) => api.post('/admin/create-worker', workerData);
export const adminUpdateReport = (reportId, updateData) => api.put(`/admin/report/status/${reportId}`, updateData);