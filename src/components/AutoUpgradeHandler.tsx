import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSurveyData } from '@/hooks/useSurveyData';
import { MessageProcessor } from '@/utils/messageProcessor';

interface AutoUpgradeHandlerProps {
  children: React.ReactNode;
}

export const AutoUpgradeHandler: React.FC<AutoUpgradeHandlerProps> = ({ children }) => {
  const { toast } = useToast();
  const { planData, upgradePlan } = useSurveyData();

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData('text');
      if (!text) return;

      // Check if it's an M-Pesa message
      if (text.includes('M-Pesa') || text.includes('Ksh') || text.includes('Till')) {
        const paymentInfo = MessageProcessor.extractPaymentInfo(text);
        
        if (paymentInfo && paymentInfo.isValid) {
          const amount = paymentInfo.amount;
          // Find matching plan
          const targetPlan = planData?.surveyPlans.find(
            plan => parseInt(plan.price) === amount
          );

          if (targetPlan) {
            // Show processing toast
            toast({
              title: "Processing Payment...",
              description: `Detected M-Pesa payment of KSh ${amount}, upgrading to ${targetPlan.planName}...`,
            });

            // Perform the upgrade
            const upgradeSuccess = await upgradePlan(targetPlan.planName);
            
            if (upgradeSuccess) {
              toast({
                title: "Plan Upgraded!",
                description: `Successfully upgraded to ${targetPlan.planName} plan`,
              });
            } else {
              toast({
                title: "Upgrade Failed",
                description: "Could not complete the upgrade. Please try again.",
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "No Matching Plan",
              description: `No plan found for KSh ${amount}`,
              variant: "destructive"
            });
          }
        }
      }
    };

    // Add paste listener
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [planData, upgradePlan, toast]);

  return <>{children}</>;
};
