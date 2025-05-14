import React from 'react';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full">
        {children}
        <button onClick={onClose} className="mt-4 text-blue-600 underline">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
