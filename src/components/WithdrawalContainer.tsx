import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, DollarSign, AlertCircle, CheckCircle, Copy, Users, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSurveyData } from '@/hooks/useSurveyData';
import { useReferral } from '../contexts/ReferralContext';
import { supabase } from '../lib/supabaseClient';

interface WithdrawalContainerProps {
  className?: string;
}

const WithdrawalContainer: React.FC<WithdrawalContainerProps> = ({ className }) => {
  const [mpesaNumber, setMpesaNumber] = useState(() => {
    return localStorage.getItem('savedWithdrawalPhone') || '';
  });
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { surveyData, getCurrentPlan } = useSurveyData();
  const { referralStats, getReferralCode, getReferralEarnings } = useReferral();

  if (!surveyData) return null;

  const currentPlan = getCurrentPlan();
  const userProgress = surveyData.userProgress;
  const availableBalance = userProgress.pendingEarnings;
  const minimumWithdrawal = currentPlan?.minimumWithdrawal || 4500;

    const handleWithdrawal = async () => {
    if (!mpesaNumber.trim()) {
      toast({
        title: "MPESA Number Required",
        description: "Please enter your MPESA number to proceed with withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount greater than zero",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawalAmount) > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have KSh ${availableBalance.toLocaleString()} available for withdrawal`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawalAmount) < minimumWithdrawal) {
      const neededAmount = minimumWithdrawal - parseFloat(withdrawalAmount);
      toast({
        title: "Amount Below Minimum",
        description: `Your current plan requires a minimum of KSh ${minimumWithdrawal.toLocaleString()} to withdraw. You need KSh ${neededAmount.toLocaleString()} more to reach the minimum.`,
        variant: "destructive",
      });
      return;
    }

    // Validate MPESA number format
    const mpesaRegex = /^(2547|07|7)\d{8}$/;
    const cleanNumber = mpesaNumber.replace(/\s+/g, '');
    
    if (!mpesaRegex.test(cleanNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid MPESA number (e.g., 2547XXXXXXXX or 07XXXXXXXX)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get user ID from localStorage (similar to useSurveyData hook)
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'default';

      // Save withdrawal request
      const withdrawalRequest = {
        id: Date.now().toString(),
        amount: parseFloat(withdrawalAmount),
        mpesaNumber: cleanNumber,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        planName: currentPlan?.planName || 'Unknown',
      };

      // Save to localStorage
      const storageKey = `withdrawalRequests_${userId}`;
      const existingRequests = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...existingRequests, withdrawalRequest]));

      // Update user progress
      const surveyStorageKey = `surveyData_${userId}`;
      const updatedSurveyData = {
        ...surveyData,
        userProgress: {
          ...surveyData.userProgress,
          pendingEarnings: surveyData.userProgress.pendingEarnings - parseFloat(withdrawalAmount),
        }
      };
      localStorage.setItem(surveyStorageKey, JSON.stringify(updatedSurveyData));

      toast({
        title: "Withdrawal Request Submitted",
        description: `KSh ${withdrawalAmount} will be sent to ${cleanNumber} within 24 hours`,
      });

      // Reset form
      setMpesaNumber('');
      setWithdrawalAmount('');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatMpesaNumber = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.startsWith('254')) {
      return clean;
    } else if (clean.startsWith('0')) {
      return `254${clean.substring(1)}`;
    } else if (clean.startsWith('7')) {
      return `254${clean}`;
    }
    return clean;
  };

  const canWithdraw = availableBalance >= minimumWithdrawal;

  return (
    <Card className={`earnings-card ${className} flex flex-col h-full`}>
      <CardHeader className="flex-shrink-0 border-b">
        <CardTitle className="flex items-center gap-2 text-lg md:text-2xl font-bold text-foreground">
          <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Withdraw Earnings
        </CardTitle>
        <CardDescription className="text-sm md:text-base text-foreground/80">
          Withdraw your earnings directly to your MPESA account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 p-2 md:p-4">
        {/* Withdrawal Scroll Container */}
        <div className="h-full border border-border/50 rounded-lg bg-muted/20">
          <div className="h-full overflow-y-scroll p-2 md:p-4 space-y-3 md:space-y-4">
            {/* Balance Display - Mobile Optimized */}
            <div className="bg-gradient-secondary/50 p-3 md:p-4 rounded-lg border border-border/50 bg-background">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm md:text-base font-medium text-foreground">Available Balance</span>
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  KSh {availableBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-1">
                <span className="text-xs md:text-sm text-foreground/70">Minimum Withdrawal</span>
                <span className="text-xs md:text-sm font-semibold text-foreground">
                  KSh {minimumWithdrawal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Status Alert */}
            {!canWithdraw && (
              <Alert className="bg-background">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs md:text-sm">
                  You need KSh {(minimumWithdrawal - availableBalance).toLocaleString()} more to reach the minimum withdrawal amount.
                </AlertDescription>
              </Alert>
            )}

            {canWithdraw && (
              <Alert className="bg-success/10 border-success">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success text-xs md:text-sm">
                  You're eligible for withdrawal!
                </AlertDescription>
              </Alert>
            )}

            {/* Withdrawal Form - Mobile Optimized */}
            <div className="space-y-3 md:space-y-4 p-3 md:p-4 bg-background rounded-lg border">
              <div>
                <Label htmlFor="mpesa-number" className="flex items-center gap-2 text-xs md:text-sm">
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                  MPESA Number
                </Label>
                <Input
                  id="mpesa-number"
                  type="tel"
                  placeholder="2547XXXXXXXX or 07XXXXXXXX"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(formatMpesaNumber(e.target.value))}
                  maxLength={13}
                  disabled={isProcessing}
                  className="border-2 focus:border-primary text-sm md:text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your registered MPESA number
                </p>
                {mpesaNumber && (
                  <p className="text-xs mt-1">
                    {mpesaNumber.length >= 10 ? (
                      <span className="text-success">✓ Valid MPESA number format</span>
                    ) : (
                      <span className="text-muted-foreground">Format: 2547XXXXXXXX or 07XXXXXXXX</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="withdrawal-amount" className="text-xs md:text-sm">Withdrawal Amount</Label>
                <Input
                  id="withdrawal-amount"
                  type="number"
                  placeholder={`Min: KSh ${minimumWithdrawal.toLocaleString()}`}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min={0}
                  max={availableBalance}
                  disabled={isProcessing}
                  className="border-2 focus:border-primary text-sm md:text-base"
                />
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs mt-1 gap-1">
                  <span className="text-muted-foreground">Min: KSh {minimumWithdrawal.toLocaleString()}</span>
                  <span className="text-muted-foreground">Max: KSh {availableBalance.toLocaleString()}</span>
                </div>
                {withdrawalAmount && (
                  <p className="text-xs mt-1">
                    {parseFloat(withdrawalAmount) >= minimumWithdrawal && parseFloat(withdrawalAmount) <= availableBalance ? (
                      <span className="text-success">✓ Valid withdrawal amount</span>
                    ) : parseFloat(withdrawalAmount) > availableBalance ? (
                      <span className="text-destructive">Amount exceeds available balance</span>
                    ) : (
                      <span className="text-muted-foreground">Amount below minimum withdrawal</span>
                    )}
                  </p>
                )}
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90 text-xs md:text-sm py-2 md:py-3"
                onClick={handleWithdrawal}
                disabled={isProcessing || !mpesaNumber || !withdrawalAmount}
              >
                {isProcessing ? "Processing..." : "Withdraw to MPESA"}
              </Button>
            </div>

            {/* Referral Code Section - Mobile Optimized */}
            <div className="border-t pt-3 md:pt-4 bg-background rounded-lg border p-3 md:p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-sm md:text-base">
                <Gift className="h-3 w-3 md:h-4 md:w-4" />
                Referral Program
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={getReferralCode()}
                      readOnly
                      className="bg-muted font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(getReferralCode());
                          toast({
                            title: "Copied!",
                            description: "Referral code copied to clipboard",
                          });
                        } catch (err) {
                          toast({
                            title: "Error",
                            description: "Failed to copy referral code",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share this code with friends to earn referral bonuses!
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Earnings:</span>
                  <span className="font-semibold text-primary">
                    KSh {getReferralEarnings().toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Referrals:</span>
                  <span className="font-semibold text-primary">
                    {referralStats.total_referrals}
                  </span>
                </div>
              </div>
            </div>

            {/* Withdrawal History - Mobile Optimized */}
            <div className="border-t pt-3 md:pt-4 pb-3 md:pb-4 bg-background rounded-lg border p-3 md:p-4">
              <h4 className="font-medium mb-2 text-sm md:text-base">Recent Withdrawals</h4>
              <WithdrawalHistory />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for referral code
const ReferralCodeSection: React.FC<{ referralCode: string }> = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={referralCode}
          readOnly
          className="bg-muted font-mono text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Share this code with friends to earn referral bonuses!
      </p>
    </div>
  );
};

// Helper component for withdrawal history
const WithdrawalHistory: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndWithdrawals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'default';
      
      const storageKey = `withdrawalRequests_${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setWithdrawals(JSON.parse(stored).slice(-3));
      }
    };
    
    fetchUserAndWithdrawals();
  }, []);

  if (withdrawals.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent withdrawals</p>;
  }

  return (
    <div className="space-y-2">
      {withdrawals.map((withdrawal) => (
        <div key={withdrawal.id} className="flex justify-between items-center text-sm">
          <div>
            <span className="font-medium">KSh {withdrawal.amount.toLocaleString()}</span>
            <span className="text-muted-foreground ml-2">to {withdrawal.mpesaNumber}</span>
          </div>
          <Badge variant={withdrawal.status === 'pending' ? 'secondary' : 'default'}>
            {withdrawal.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default WithdrawalContainer;
