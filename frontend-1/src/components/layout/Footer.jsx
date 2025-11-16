import React from 'react';
import { FaRecycle } from 'react-icons/fa6';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <FaRecycle className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="font-bold text-lg">GreenReport</p>
        <p className="text-sm text-gray-400 mt-2">
          © {new Date().getFullYear()} GreenReport. All rights reserved.
        </p>
        <p className="text-sm text-gray-400">
          Empowering citizens for a cleaner tomorrow.
        </p>
      </div>
    </footer>
  );
}

export default Footer;