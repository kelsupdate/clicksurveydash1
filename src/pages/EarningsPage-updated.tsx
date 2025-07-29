import React from 'react';
import { useReferral } from '@/contexts/ReferralContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { DollarSign } from 'lucide-react';

const EarningsPage = () => {
  const { referralStats } = useReferral();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-[240px] mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Earnings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Referral Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KSh {referralStats?.total_earned || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Completed Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{referralStats?.completed_referrals || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">KSh {referralStats?.pending_referrals * 50 || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Per Referral Reward</span>
                  <span className="font-bold">KSh 50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Referrals</span>
                  <span className="font-bold">{referralStats?.completed_referrals || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Referrals</span>
                  <span className="font-bold">{referralStats?.pending_referrals || 0}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-600 font-medium">Total Earned</span>
                  <span className="font-bold text-green-600">KSh {referralStats?.total_earned || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EarningsPage;
