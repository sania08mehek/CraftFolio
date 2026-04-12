import React, { useEffect } from 'react';

const Toast = ({ message, type, show, onHide }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <div 
      className={`toast ${show ? 'show' : ''}`} 
      style={{ color: type === 'ok' ? 'var(--success)' : 'var(--warn)' }}
    >
      {type === 'ok' ? '✓ ' : '⚠ '} {message}
    </div>
  );
};

export default Toast;
