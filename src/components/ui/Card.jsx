import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`border border-gray-200 rounded shadow p-4 bg-white ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
