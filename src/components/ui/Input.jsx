import React from 'react';

export const Input = ({ type = 'text', className = '', ...props }) => (
  <input
    type={type}
    className={`border border-gray-300 rounded px-3 py-2 ${className}`}
    {...props}
  />
);

export default Input;
