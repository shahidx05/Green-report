import React from 'react';
import { Link } from 'react-router-dom';
// --- Updated Icons (Added FaCode) ---
import { FaRecycle, FaGithub, FaLinkedin, FaHeart, FaXTwitter, FaCode } from 'react-icons/fa6';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaRecycle className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold tracking-wide">TrashTrace</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering citizens to build cleaner communities. Report waste, track progress, and see the change in your city.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-green-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-green-400 transition-colors">Submit Report</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-green-400 transition-colors">Track Status</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-green-400 transition-colors">Employee Login</Link>
              </li>
              
              {/* --- NEW: Dedicated Source Code Option --- */}
              <li className="pt-2">
                <a 
                  href="https://github.com/shahidx05/trash-trace" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  <FaCode className="mr-2" /> Source Code
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Developer / Connect Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Connect</h3>
            <p className="text-gray-400 text-sm mb-4">
              Built by 
              <span className="text-white font-medium"> Shahid Khan</span>
            </p>
            
            <div className="flex space-x-4">
              {/* GitHub Profile */}
              <a 
                href="https://github.com/shahidx05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-all"
                title="GitHub Profile"
              >
                <FaGithub className="text-xl" />
              </a>

              {/* LinkedIn Profile */}
              <a 
                href="https://www.linkedin.com/in/shahidx05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                title="LinkedIn Profile"
              >
                <FaLinkedin className="text-xl" />
              </a>

              {/* X (Twitter) Profile */}
              <a 
                href="https://x.com/shahidx_05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                title="Follow on X"
              >
                <FaXTwitter className="text-xl" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TrashTrace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;