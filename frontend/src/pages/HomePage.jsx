import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx'; 
import Footer from '../components/layout/Footer.jsx'; 
import Hero from '../components/home/Hero.jsx'; 
import ReportMap from '../components/map/ReportMap.jsx'; 
import HowItWorks from '../components/home/HowItWorks.jsx'; 
import { FaArrowRight } from "react-icons/fa6";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <Hero /> 
        <HowItWorks />
        <ReportMap />

        {/* --- Floating Gradient Call to Action --- */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-700"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>

                <div className="relative z-10 py-16 px-8 text-center text-white">
                   <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                     Ready to clean up your city?
                   </h2>
                   <p className="text-green-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                     Join thousands of citizens making a real impact. It only takes 10 seconds.
                   </p>
                   <Link to="/submit">
                      <button className="inline-flex items-center px-8 py-4 text-lg font-bold text-green-700 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all transform">
                        Start Reporting Now <FaArrowRight className="ml-2" />
                      </button>
                   </Link>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;