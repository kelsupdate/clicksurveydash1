import React, { useState } from 'react';
import { useReferral } from '@/contexts/ReferralContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Gift, Users, DollarSign, Copy } from 'lucide-react';
import { addReferral } from '@/lib/localReferralService';

const ReferralsPage = () => {
  const { referralStats, referrals, refreshReferralData } = useReferral();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReferral = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = addReferral(email);
      
      if (success) {
        toast({
          title: "Referral Sent!",
          description: `Invitation sent to ${email}. You'll earn KSh 50 when they complete their first survey.`,
        });
        setEmail("");
        refreshReferralData();
      } else {
        toast({
          title: "Failed to send referral",
          description: "This email may already be referred or daily limit reached.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send referral. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralStats) {
      navigator.clipboard.writeText(referralStats.referral_code);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-[240px] mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Refer & Earn</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{referralStats?.total_referrals || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-green-600">{referralStats?.completed_referrals || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-yellow-600">{referralStats?.pending_referrals || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-green-600">KSh {referralStats?.total_earned || 0}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Send Referral</CardTitle>
              <CardDescription className="text-sm">Invite friends to earn KSh 50 per referral</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <Input
                  type="email"
                  placeholder="Enter friend's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Button 
                  onClick={handleSendReferral} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Sending..." : "Send Referral"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Your Referral Code</CardTitle>
              <CardDescription className="text-sm">Share this code with friends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-purple-700">Your Referral Code</div>
                      <div className="text-lg font-mono font-bold text-purple-600">{referralStats?.referral_code || "Loading..."}</div>
                    </div>
                    <Button onClick={copyReferralCode} className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {referrals.length > 0 && (
          <Card className="mt-4 md:mt-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-2 md:p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">{referral.referred_email}</p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      referral.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : referral.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {referral.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ReferralsPage;
