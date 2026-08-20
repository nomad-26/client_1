import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-primary text-on-primary px-6 py-4 border-l-4 border-tertiary-container shadow-xl">
      <span className="material-symbols-outlined text-tertiary-container">
        {type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
      </span>
      <p className="font-body-md text-sm text-on-primary">{message}</p>
      <button onClick={onClose} className="ml-4 text-secondary hover:text-white transition-colors">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
