import React from 'react';
import ToastNotification, { ToastMessage } from './ToastNotification';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
