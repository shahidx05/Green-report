import React from 'react';

function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;