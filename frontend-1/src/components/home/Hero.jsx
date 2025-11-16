import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Icons: FaCirclePlus is in FA6, FaSearch is in FA5
import { FaCirclePlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

function Hero() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-white text-center p-8 md:p-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4"
        variants={itemVariants}
      >
        Help Keep Your City Clean
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        variants={itemVariants}
      >
        See a waste zone? Report it in seconds. Track its status and see your impact.
      </motion.p>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col md:flex-row justify-center items-center gap-4"
        variants={itemVariants}
      >
        {/* Submit Report Button */}
        <Link to="/submit" className="w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-full shadow-lg hover:bg-primary-dark"
          >
            <FaCirclePlus className="mr-2" />
            Submit a New Report
          </motion.button>
        </Link>
        
        {/* Track Report Button */}
        <Link to="/track" className="w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto flex items-center justify-center px-8 py-3 text-base font-medium text-primary-dark bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50"
          >
            <FaSearch className="mr-2" />
            Track a Report
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default Hero;
