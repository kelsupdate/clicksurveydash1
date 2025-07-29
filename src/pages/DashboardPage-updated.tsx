import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/contexts/ReferralContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, TrendingUp, Gift } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const DashboardPage = () => {
  const { user } = useAuth();
  const { referralStats } = useReferral();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-[240px] mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referralStats?.total_referrals || 0}</div>
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
              <CardTitle className="text-sm font-medium">Pending Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{referralStats?.pending_referrals || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KSh {referralStats?.total_earned || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-purple-700">Your Referral Code</div>
                    <div className="text-2xl font-mono font-bold text-purple-600">{referralStats?.referral_code || "Loading..."}</div>
                  </div>
                  <Button 
                    onClick={() => navigator.clipboard.writeText(referralStats?.referral_code || "")}
                    className="flex items-center gap-2"
                  >
                    <Gift className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button onClick={() => navigate('/referrals')} className="w-full">
                  View Referrals
                </Button>
                <Button onClick={() => navigate('/settings')} className="w-full">
                  Manage Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
