import React from 'react';

interface SimpleEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const SimpleEmailModal: React.FC<SimpleEmailModalProps> = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Email Verification</h2>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>
          Email: {email || 'test@example.com'}
        </p>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>
          This popup appears immediately on signup button click!
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SimpleEmailModal;
