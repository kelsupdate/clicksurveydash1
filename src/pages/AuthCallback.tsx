import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from URL
        const code = searchParams.get('code');
        
        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            navigate('/login?error=verification_failed');
            return;
          }

          if (data.session) {
            // Successfully verified - redirect to login with success message
            navigate('/login?verified=true');
          }
        } else {
          // No code provided - redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login?error=verification_failed');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h2>
        <p className="text-gray-600">You'll be redirected to the login page shortly.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
