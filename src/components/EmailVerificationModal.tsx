import React from 'react';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResendEmail: () => void;
  onConfirmSignup?: () => void;
  isLoading?: boolean;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onResendEmail,
  onConfirmSignup,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-2xl border border-gray-200">
          <div className="p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Confirm Your Registration
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Ready to create your account with:
            </p>
            <p className="text-sm font-medium text-blue-600 text-center mb-4 break-all">
              {email}
            </p>
            <p className="text-sm text-gray-600 text-center mb-6">
              Click "Confirm & Create Account" to complete your registration and receive a verification email.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 ml-2">
                  <strong>Note:</strong> Check your email for SurveyDash verification link.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="w-full sm:w-auto flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={onConfirmSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Confirm & Create Account'
                )}
              </button>
              <button
                type="button"
                className="w-full sm:w-auto flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
