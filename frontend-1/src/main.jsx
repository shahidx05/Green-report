import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// --- IMPORT ALL OUR STYLES ---
import 'leaflet/dist/leaflet.css';       // Leaflet's map styles
import 'leaflet/dist/leaflet-src.js';    // Leaflet's JS
import './index.css';                  // Your new Tailwind styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)