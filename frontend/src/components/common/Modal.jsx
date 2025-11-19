import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXmark } from 'react-icons/fa6';

// Added 'size' prop: 'md', 'lg', 'xl'
function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  
  if (!isOpen) return null;

  // Size classes
  const maxWidthClass = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',     // <-- We will use this for the Report Modal
    full: 'max-w-full mx-4'
  }[size] || 'max-w-md';

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* 1. Overlay - CHANGED to "Fade Gray" with Blur */}
          <motion.div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm" // Lighter, blurry gray
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 2. Modal Content - Dynamic Width */}
          <motion.div
            className={`relative z-10 w-full ${maxWidthClass} bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-20">
              <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none"
              >
                <FaXmark className="h-5 w-5" />
              </button>
            </div>

            {/* Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Modal;