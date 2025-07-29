import React from 'react';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            SurveyDash Email Sent
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Verification email sent to:
          </p>
          
          <p className="text-sm font-medium text-blue-600 mb-6 break-all">
            {email || 'your-email@example.com'}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Click the link in your email to activate your SurveyDash account.
          </p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              I've verified my email
            </button>
            
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;
