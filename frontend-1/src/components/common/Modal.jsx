import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6'; // Sahi 'X' icon

function Modal({ isOpen, onClose, title, children }) {
  
  // Jab 'isOpen' false ho, toh kuch bhi render na karein
  if (!isOpen) {
    return null;
  }

  // Modal ko 'document.body' mein render karne ke liye Portal ka istemal
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* 1. Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
            onClick={onClose} // Overlay par click karke modal band karein
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 2. Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close modal"
              >
                <FaXmark className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body // Modal ko yahan render karein
  );
}

export default Modal;