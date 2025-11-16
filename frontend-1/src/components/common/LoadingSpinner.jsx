import React from 'react';
import { FaCircleNotch } from 'react-icons/fa6'; // Ek bharosemand spinner icon

/**
 * Ek simple spinner component.
 * @param {string} size - 'sm', 'md', 'lg' (Tailwind text sizes)
 * @param {string} className - Extra classes
 */
function LoadingSpinner({ size = 'md', className = '', text = '' }) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FaCircleNotch 
        className={`animate-spin text-primary ${sizeClasses[size]}`} 
        aria-label="Loading..."
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;