import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getReferralStats, 
  getReferrals, 
  ReferralStats, 
  Referral 
} from '../lib/localReferralService';

interface ReferralContextType {
  referralStats: ReferralStats;
  referrals: Referral[];
  refreshReferralData: () => void;
  getReferralCode: () => string;
  getReferralEarnings: () => number;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

interface ReferralProviderProps {
  children: ReactNode;
}

export const ReferralProvider: React.FC<ReferralProviderProps> = ({ children }) => {
  const [referralStats, setReferralStats] = useState<ReferralStats>(getReferralStats());
  const [referrals, setReferrals] = useState<Referral[]>(getReferrals());

  const refreshReferralData = () => {
    setReferralStats(getReferralStats());
    setReferrals(getReferrals());
  };

  const getReferralCode = () => {
    return referralStats.referral_code;
  };

  const getReferralEarnings = () => {
    return referralStats.total_earned;
  };

  useEffect(() => {
    // Refresh data on mount and when localStorage changes
    refreshReferralData();
    
    // Listen for storage changes (in case other tabs update the data)
    const handleStorageChange = () => {
      refreshReferralData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ReferralContext.Provider value={{
      referralStats,
      referrals,
      refreshReferralData,
      getReferralCode,
      getReferralEarnings
    }}>
      {children}
    </ReferralContext.Provider>
  );
};
