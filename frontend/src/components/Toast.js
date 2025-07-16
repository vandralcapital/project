import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      background: type === 'error' ? '#d9534f' : type === 'info' ? '#0275d8' : '#5cb85c',
      color: 'white',
      padding: '16px 32px',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontWeight: 600,
      fontSize: 16
    }}>
      {message}
    </div>
  );
};

export default Toast; 