import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSurveyData } from '@/hooks/useSurveyData';

interface ReferralCodeInputProps {
  className?: string;
}

const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({ className }) => {
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const { toast } = useToast();
  const { surveyData } = useSurveyData();

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate referral code (in real app, this would check against backend)
      const validReferralCodes = ['FRIEND2024', 'WELCOME100', 'EARNMORE', 'SURVEYPRO'];
      
      if (validReferralCodes.includes(referralCode.toUpperCase())) {
        // Get user ID
        const { data: { user } } = await (await import('@/lib/supabaseClient')).supabase.auth.getUser();
        if (!user) return;

        // Save applied referral code
        const storageKey = `appliedReferral_${user.id}`;
        localStorage.setItem(storageKey, referralCode.toUpperCase());

        // Update user progress with bonus
        const userProgressKey = `surveyData_${user.id}`;
        const currentData = localStorage.getItem(userProgressKey);
        if (currentData) {
          const data = JSON.parse(currentData);
          data.userProgress.pendingEarnings += 100; // Bonus for referral
          data.userProgress.totalEarnings += 100;
          localStorage.setItem(userProgressKey, JSON.stringify(data));
        }

        setIsApplied(true);
        toast({
          title: "Success!",
          description: "Referral code applied! You received KSh 100 bonus",
        });

        // Refresh page to show updated data
        window.location.reload();
      } else {
        toast({
          title: "Invalid Code",
          description: "This referral code is not valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply referral code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkIfAlreadyApplied = async () => {
    try {
      const { data: { user } } = await (await import('@/lib/supabaseClient')).supabase.auth.getUser();
      if (user) {
        const storageKey = `appliedReferral_${user.id}`;
        const appliedCode = localStorage.getItem(storageKey);
        if (appliedCode) {
          setIsApplied(true);
          setReferralCode(appliedCode);
        }
      }
    } catch (error) {
      console.error('Error checking referral status:', error);
    }
  };

  React.useEffect(() => {
    checkIfAlreadyApplied();
  }, []);

  if (isApplied) {
    return (
      <Card className={`${className} bg-success/10 border-success`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Referral code applied successfully!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Apply Referral Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="referral-code">Enter referral code</Label>
            <Input
              id="referral-code"
              placeholder="e.g., FRIEND2024"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              maxLength={20}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Get KSh 100 bonus for applying a valid referral code
            </p>
          </div>
          <Button 
            onClick={handleApplyReferral}
            disabled={isSubmitting || !referralCode.trim()}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {isSubmitting ? "Applying..." : "Apply Referral Code"}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Valid codes: FRIEND2024, WELCOME100, EARNMORE, SURVEYPRO</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCodeInput;
