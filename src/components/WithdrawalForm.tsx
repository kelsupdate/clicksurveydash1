import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSurveyData } from '@/hooks/useSurveyData';
import { supabase } from '@/lib/supabaseClient';

const WithdrawalForm: React.FC = () => {
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [userId, setUserId] = useState('default');
  const { toast } = useToast();
  const { surveyData, getCurrentPlan } = useSurveyData();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || 'default');
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      const storageKey = `withdrawalRequests_${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setWithdrawals(JSON.parse(stored));
      }
    }
  }, [userId]);

  if (!surveyData) return null;

  const currentPlan = getCurrentPlan();
  const userProgress = surveyData.userProgress;
  const availableBalance = userProgress.pendingEarnings;
  const minimumWithdrawal = currentPlan?.minimumWithdrawal || 4500;

  const handleWithdrawal = async () => {
    if (!mpesaNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your MPESA number",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawalAmount) > availableBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance for withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawalAmount) < minimumWithdrawal) {
      toast({
        title: "Error",
        description: `Minimum withdrawal is KSh ${minimumWithdrawal.toLocaleString()}`,
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
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Withdraw to MPESA
          </CardTitle>
          <CardDescription>
            Enter your MPESA number to receive your earnings
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <span className="text-2xl font-bold text-primary">
                  KSh {availableBalance.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Minimum Withdrawal</span>
                <span className="text-lg font-medium">
                  KSh {minimumWithdrawal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {!canWithdraw && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need KSh {(minimumWithdrawal - availableBalance).toLocaleString()} more to reach the minimum withdrawal amount.
              </AlertDescription>
            </Alert>
          )}

          {canWithdraw && (
            <Alert className="bg-success/10 border-success">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                You're eligible for withdrawal! Enter your MPESA details below.
              </AlertDescription>
            </Alert>
          )}

          {/* Withdrawal Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="mpesa-number" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                MPESA Phone Number
              </Label>
              <Input
                id="mpesa-number"
                type="tel"
                placeholder="2547XXXXXXXX or 07XXXXXXXX"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(formatMpesaNumber(e.target.value))}
                maxLength={13}
                disabled={!canWithdraw || isProcessing}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your registered MPESA number where you want to receive the money
              </p>
            </div>

            <div>
              <Label htmlFor="withdrawal-amount">Withdrawal Amount (KSh)</Label>
              <Input
                id="withdrawal-amount"
                type="number"
                placeholder={`Min: KSh ${minimumWithdrawal.toLocaleString()}`}
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                min={minimumWithdrawal}
                max={availableBalance}
                disabled={!canWithdraw || isProcessing}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can withdraw between KSh {minimumWithdrawal.toLocaleString()} and KSh {availableBalance.toLocaleString()}
              </p>
            </div>

            <Button 
              className="w-full bg-gradient-primary hover:opacity-90"
              onClick={handleWithdrawal}
              disabled={!canWithdraw || isProcessing || !mpesaNumber || !withdrawalAmount}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Withdraw KSh ${withdrawalAmount || '0'}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Withdrawal History</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} History
            </Button>
          </CardTitle>
          <CardDescription>
            Track your recent withdrawal requests
          </CardDescription>
        </CardHeader>
        
        {showHistory && (
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No withdrawal requests yet
              </p>
            ) : (
              <div className="space-y-3">
                {withdrawals.slice(-5).map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">KSh {withdrawal.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.mpesaNumber} • {new Date(withdrawal.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={withdrawal.status === 'pending' ? 'secondary' : 'default'}
                      className={withdrawal.status === 'completed' ? 'bg-success' : ''}
                    >
                      {withdrawal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default WithdrawalForm;
