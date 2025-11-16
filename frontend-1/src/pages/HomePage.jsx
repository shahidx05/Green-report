import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import ReportMap from '../components/map/ReportMap'; // Map component
import { useAuth } from '../hooks/useAuth'; // Auth hook

function HomePage() {
  const auth = useAuth(); // Auth context ka istemaal

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Navbar, auth state ke saath */}
      <main className="flex-grow">
        <Hero /> {/* Hero section (Search/Submit buttons) */}
        <ReportMap /> {/* Live Map */}
      </main>
      {/* Footer component yahan add kar sakte hain */}
    </div>
  );
}

export default HomePage;