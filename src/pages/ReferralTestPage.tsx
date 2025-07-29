import React from 'react';
import { useReferral } from '@/contexts/ReferralContext';

const ReferralTestPage = () => {
  const { referralStats, referrals, refreshReferralData } = useReferral();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Referral System Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Referral Stats:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(referralStats, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Referrals:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(referrals, null, 2)}
          </pre>
        </div>
        
        <button 
          onClick={refreshReferralData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default ReferralTestPage;
