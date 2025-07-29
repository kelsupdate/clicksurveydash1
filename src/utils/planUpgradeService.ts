/**
 * Plan Upgrade Service
 * Handles automatic plan upgrades after successful M-Pesa verification
 */

import { SurveyPlan } from '@/hooks/useSurveyData';

export interface PlanUpgradeResult {
  success: boolean;
  message: string;
  newPlan?: SurveyPlan;
  oldPlan?: string;
}

export class PlanUpgradeService {
  /**
   * Map payment amount to corresponding plan
   * @param amount - Payment amount in KSh
   * @param availablePlans - Available survey plans
   * @returns Corresponding plan or null
   */
  static getPlanByAmount(amount: number, availablePlans: SurveyPlan[]): SurveyPlan | null {
    // Filter out free plans and sort by price (ascending)
    const paidPlans = [...availablePlans]
      .filter(plan => parseFloat(plan.price) > 0)
      .sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return priceA - priceB;
      });

    console.log("Available paid plans:", paidPlans.map(p => ({name: p.planName, price: p.price})));
    console.log("Looking for plan with amount:", amount);

    // Find exact match first
    const exactMatch = paidPlans.find(plan => parseFloat(plan.price) === amount);
    if (exactMatch) {
      console.log("Found exact match:", exactMatch.planName);
      return exactMatch;
    }

    // If no exact match, find the closest higher plan
    const higherPlan = paidPlans.find(plan => parseFloat(plan.price) >= amount);
    if (higherPlan) {
      console.log("Found higher plan:", higherPlan.planName);
      return higherPlan;
    }

    // If amount is higher than all plans, return the highest plan
    if (paidPlans.length > 0) {
      const highestPlan = paidPlans[paidPlans.length - 1];
      console.log("Returning highest plan:", highestPlan.planName);
      return highestPlan;
    }

    console.log("No suitable plan found for amount:", amount);
    return null;
  }

  /**
   * Validate if a plan upgrade is possible
   * @param currentPlanName - Current plan name
   * @param targetPlanName - Target plan name
   * @param availablePlans - Available plans
   * @returns Validation result
   */
  static validateUpgrade(
    currentPlanName: string,
    targetPlanName: string,
    availablePlans: SurveyPlan[]
  ): { isValid: boolean; message: string } {
    const currentPlan = availablePlans.find(p => p.planName === currentPlanName);
    const targetPlan = availablePlans.find(p => p.planName === targetPlanName);

    if (!currentPlan || !targetPlan) {
      return { isValid: false, message: "Invalid plan selection" };
    }

    const currentPrice = parseFloat(currentPlan.price);
    const targetPrice = parseFloat(targetPlan.price);

    // Allow upgrade even to same plan for testing purposes
    // In production, you might want to keep the restriction
    if (currentPrice > targetPrice) {
      return { 
        isValid: false, 
        message: "Cannot downgrade to a lower plan" 
      };
    }

    return { isValid: true, message: "Upgrade validated successfully" };
  }

  /**
   * Process plan upgrade after verification
   * @param userId - User ID
   * @param verifiedAmount - Verified payment amount
   * @param availablePlans - Available survey plans
   * @returns Upgrade result
   */
  static async processPlanUpgrade(
    userId: string,
    verifiedAmount: number,
    availablePlans: SurveyPlan[]
  ): Promise<PlanUpgradeResult> {
    try {
      const targetPlan = this.getPlanByAmount(verifiedAmount, availablePlans);
      
      if (!targetPlan) {
        return {
          success: false,
          message: "No plan found for the verified amount"
        };
      }

      // In a real implementation, this would update the database
      // For now, we'll simulate the update
      const currentPlanName = "Starter"; // This would come from user data
      
      const validation = this.validateUpgrade(currentPlanName, targetPlan.planName, availablePlans);
      
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message
        };
      }

      // Simulate database update
      // In real implementation, this would be an API call to update user's plan
      console.log(`Updating user ${userId} plan to ${targetPlan.planName}`);
      
      return {
        success: true,
        message: `Plan successfully upgraded to ${targetPlan.planName}`,
        newPlan: targetPlan,
        oldPlan: currentPlanName
      };
      
    } catch (error) {
      return {
        success: false,
        message: "Failed to process plan upgrade"
      };
    }
  }
}
