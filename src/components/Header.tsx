import React, { useState } from 'react';
import { UserCircle, LogOut, DollarSign } from 'lucide-react';
import { useSurveyData } from '@/hooks/useSurveyData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileHeader } from './MobileHeader-enhanced';
import { useSidebar } from '@/contexts/SidebarContext';

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>('User');
  const { surveyData } = useSurveyData();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Use MobileHeader for mobile devices
  if (isMobile) {
    return (
      <MobileHeader 
        onToggleSidebar={toggleSidebar}
        userName={userName}
        userEmail={user?.email || 'user@example.com'}
        userBalance={surveyData?.userProgress.pendingEarnings || 0}
        onLogout={handleLogout}
      />
    );
  }

  // Desktop header
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 shadow-lg z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo/Title */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">SurveyDash</h1>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{userName}</p>
            {surveyData && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-white/80" />
                <p className="text-xs text-white/80">
                  KSh {surveyData.userProgress.pendingEarnings.toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-white/20 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
