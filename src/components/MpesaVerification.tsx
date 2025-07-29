import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MpesaVerifier } from "@/utils/mpesaVerification";
import { PlanUpgradeService } from "@/utils/planUpgradeService";
import { useSurveyData } from "@/hooks/useSurveyData";

interface MpesaVerificationProps {
  onVerificationComplete: (verified: boolean, message: string, details: any) => void;
  planName?: string;
  amount?: string;
}

export const MpesaVerification = ({ 
  onVerificationComplete, 
  planName, 
  amount 
}: MpesaVerificationProps) => {
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();
  const { planData, upgradePlan } = useSurveyData();

  const handleVerify = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please paste your M-Pesa confirmation message",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = MpesaVerifier.verifyMessage(message);
      
      if (result.isValid) {
        // Enhanced amount extraction with multiple patterns
        let verifiedAmount = 0;
        
        // Pattern 1: KSH 250.00
        const pattern1 = message.match(/(?:KSH|KES|Ksh|kes)\s*([\d,]+\.?\d*)/i);
        if (pattern1) {
          verifiedAmount = parseFloat(pattern1[1].replace(/,/g, ''));
        }
        
        // Pattern 2: 250.00 KSH
        const pattern2 = message.match(/([\d,]+\.?\d*)\s*(?:KSH|KES|Ksh|kes)/i);
        if (!pattern1 && pattern2) {
          verifiedAmount = parseFloat(pattern2[1].replace(/,/g, ''));
        }
        
        // Pattern 3: KES250
        const pattern3 = message.match(/(?:KSH|KES|Ksh|kes)(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
        if (!pattern1 && !pattern2 && pattern3) {
          verifiedAmount = parseFloat(pattern3[1].replace(/,/g, ''));
        }
        
        if (verifiedAmount > 0 && planData && planData.surveyPlans) {
          // Find matching plan based on amount
          const targetPlan = PlanUpgradeService.getPlanByAmount(verifiedAmount, planData.surveyPlans);
          
          if (targetPlan) {
            setIsUpgrading(true);
            
            // Upgrade the plan - this will automatically:
            // 1. Update the profile sidebar (currentPlan changes)
            // 2. Update survey limits (dailySurvey property)
            // 3. Update withdrawal limits (minimumWithdrawal property)
            // 4. Update package display (planName changes)
            const upgradeSuccess = upgradePlan(targetPlan.planName);
            
            if (upgradeSuccess) {
              toast({
                title: "Plan Upgraded Successfully!",
                description: `Your plan has been upgraded to ${targetPlan.planName}. You now have access to ${targetPlan.dailySurvey} surveys per day and minimum withdrawal of KSh ${targetPlan.minimumWithdrawal}.`,
              });
              
              // Update verification result with upgrade info
              setVerificationResult({
                ...result,
                upgradedPlan: targetPlan,
                message: `Payment verified and plan upgraded to ${targetPlan.planName}`
              });
              
              // Call onVerificationComplete with upgrade info
              onVerificationComplete(true, message, {
                ...result.details,
                upgradedPlan: targetPlan,
                amount: verifiedAmount
              });
            } else {
              toast({
                variant: "destructive",
                title: "Upgrade Failed",
                description: "Failed to upgrade your plan. Please try again.",
              });
            }
            setIsUpgrading(false);
          } else {
            toast({
              variant: "destructive",
              title: "No Plan Found",
              description: `No plan found for KSh ${verifiedAmount}. Please check your payment amount.`,
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Payment",
            description: "Could not process your payment. Please check the amount and try again.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.message,
        });
      }
      
      setVerificationResult(result);
      onVerificationComplete(result.isValid, message, result.details);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Failed to verify payment. Please try again.",
      });
    } finally {
      setIsVerifying(false);
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            M-Pesa Payment Verification
            {planName && amount && (
              <Badge variant="outline" className="ml-2">
                {planName} - KSh {amount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Paste your M-Pesa confirmation message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste your M-Pesa confirmation message here..."
              className="min-h-[100px] font-mono text-sm"
              disabled={isVerifying || verificationResult?.isValid}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleVerify}
              disabled={isVerifying || isUpgrading || !message.trim() || verificationResult?.isValid}
              className="flex-1"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : isUpgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading Plan...
                </>
              ) : (
                "Verify Payment"
              )}
            </Button>
          </div>

          {verificationResult && (
            <Card className={`border-l-4 ${verificationResult.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h4 className="font-semibold">
                      {verificationResult.isValid ? 'Payment Verified' : 'Verification Failed'}
                    </h4>
                    <p className="text-sm">{verificationResult.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}