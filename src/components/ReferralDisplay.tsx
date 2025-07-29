import React from 'react';
import { useReferral } from '@/contexts/ReferralContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Users, DollarSign, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const ReferralStatsCard: React.FC = () => {
  const { referralStats } = useReferral();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralStats.referral_code);
    toast({
      title: "Referral code copied!",
      description: "Share this code with friends to earn rewards.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-600" />
          Your Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{referralStats.total_referrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${referralStats.total_earned}</div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{referralStats.pending_referrals}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Your Referral Code</div>
              <div className="text-lg font-mono font-bold text-purple-600">{referralStats.referral_code}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralCode}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReferralEarningsCard: React.FC = () => {
  const { referralStats } = useReferral();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Referral Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Earned from Referrals</span>
            <span className="font-bold text-green-600">${referralStats.total_earned}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Completed Referrals</span>
            <span className="font-bold">{referralStats.completed_referrals}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending Rewards</span>
            <span className="font-bold text-orange-600">${referralStats.pending_referrals * 50}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReferralCodeDisplay: React.FC = () => {
  const { referralStats } = useReferral();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralStats.referral_code);
    toast({
      title: "Referral code copied!",
      description: "Share this code with friends to earn rewards.",
    });
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-purple-900">Your Referral Code</h4>
          <p className="text-2xl font-bold font-mono text-purple-600">{referralStats.referral_code}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyReferralCode}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
    </div>
  );
};
