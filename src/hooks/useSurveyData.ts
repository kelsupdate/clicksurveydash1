import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SurveyPlan {
  planName: string;
  dailySurvey: number;
  monthlyIncome: number;
  dailyIncome: number;
  earningPerSurvey: string;
  minimumWithdrawal: number;
  price: string;
  description?: string;
  features?: string[];
}

interface Question {
  id: string;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string | null;
}

export interface Survey {
  id: string;
  title: string;
  reward: number;
  duration: string;
  category: string;
  difficulty: string;
  status: string;
  description: string;
  requiredPlan: string;
  questions?: Question[];
}

export interface UserProgress {
  currentPlan: string;
  surveysCompletedToday: number;
  totalEarnings: number;
  pendingEarnings: number;
  completedSurveys: string[];
  referrals: {
    totalReferrals: number;
    referralEarnings: number;
    referralCode: string;
  };
}

export interface PlanData {
  visibility: boolean;
  surveyPlans: SurveyPlan[];
  mpesaPaymentDetails: {
    tillName: string;
    tillNumber: number;
  };
  moneyMaking: any[];
  limits: {
    withdrawal: Record<string, number>;
    survey: Record<string, number>;
  };
  currentPlan: {
    default: string;
    displayName: string;
    description: string;
  };
}

export interface SurveyData {
  surveys: Survey[];
  userProgress: UserProgress;
}

export const useSurveyData = () => {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [verifiedPlan, setVerifiedPlan] = useState<string | null>(null);

  // Fetch plan data from centralized source
  const fetchPlanData = async () => {
    try {
      const response = await fetch('/plan.json');
      if (!response.ok) throw new Error('Failed to fetch plan data');
      const data = await response.json();
      setPlanData(data);
      return data;
    } catch (error) {
      console.error('Error fetching plan data:', error);
      return null;
    }
  };

  // Fetch user-specific survey data
  const fetchSurveyData = async (userId: string) => {
    try {
      const response = await fetch('/data/survey.json');
      if (!response.ok) throw new Error('Failed to fetch survey data');
      const data = await response.json();
      
      // Load user-specific data from localStorage
      const storageKey = `surveyData_${userId}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const userData = JSON.parse(storedData);
        return { ...data, userProgress: userData.userProgress };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching survey data:', error);
      return null;
    }
  };

  // Handle payment verification and plan upgrade
  const verifyPaymentAndUpgradePlan = async (paymentAmount: number, transactionId: string) => {
    if (!planData || !userId) return false;

    // Find matching plan based on payment amount
    const targetPlan = planData.surveyPlans.find(
      plan => parseInt(plan.price) === paymentAmount
    );

    if (!targetPlan) {
      console.error('No matching plan found for payment amount:', paymentAmount);
      return false;
    }

    try {
      // Update user plan in Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          current_plan: targetPlan.planName,
          plan_updated_at: new Date().toISOString(),
          last_payment_amount: paymentAmount,
          last_payment_transaction_id: transactionId
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating plan in database:', error);
        return false;
      }

      // Update local state
      setSurveyData(prev => {
        if (!prev) return null;
        
        const updatedData = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            currentPlan: targetPlan.planName
          }
        };

        // Save to user-specific localStorage as backup
        const storageKey = `surveyData_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        
        return updatedData;
      });

      setVerifiedPlan(targetPlan.planName);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('plan-upgraded', {
        detail: { newPlan: targetPlan.planName, amount: paymentAmount }
      }));
      
      return true;
      
    } catch (error) {
      console.error('Failed to process plan upgrade:', error);
      return false;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      // Fetch plan data
      const plan = await fetchPlanData();
      
      // Fetch user data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const survey = await fetchSurveyData(user.id);
        setSurveyData(survey);
      } else {
        // Use fallback data for demo
        const surveyResponse = await fetch('/data/survey.json');
        const survey = await surveyResponse.json();
        survey.userProgress = {
          currentPlan: plan?.currentPlan?.default || "Starter",
          surveysCompletedToday: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          completedSurveys: [],
          referrals: {
            totalReferrals: 0,
            referralEarnings: 0,
            referralCode: "REF_DEMO123"
          }
        };
        setSurveyData(survey);
      }
      
      setLoading(false);
    };

    initializeData();
  }, []);

  // Handle real-time updates
  useEffect(() => {
    const handlePlanUpdate = (event: CustomEvent) => {
      const { newPlan } = event.detail;
      if (newPlan && planData) {
        setSurveyData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            userProgress: {
              ...prev.userProgress,
              currentPlan: newPlan
            }
          };
        });
      }
    };

    window.addEventListener('plan-upgraded', handlePlanUpdate);
    return () => window.removeEventListener('plan-upgraded', handlePlanUpdate);
  }, [planData]);

  const getCurrentPlan = () => {
    if (!planData || !surveyData) return null;
    return planData.surveyPlans.find(
      plan => plan.planName === surveyData.userProgress.currentPlan
    );
  };

  const getAvailableSurveys = () => {
    if (!surveyData) return [];
    return surveyData.surveys;
  };

  const upgradePlan = async (newPlanName: string) => {
    if (!planData || !surveyData || !userId) return false;

    const targetPlan = planData.surveyPlans.find(plan => plan.planName === newPlanName);
    if (!targetPlan) return false;

    try {
      // Update user plan in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          current_plan: newPlanName,
          plan_updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating plan in database:', error);
        return false;
      }

      // Update local state
      setSurveyData(prev => {
        if (!prev) return null;
        
        const updatedData = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            currentPlan: newPlanName
          }
        };

        const storageKey = `surveyData_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        
        return updatedData;
      });

      setVerifiedPlan(newPlanName);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('plan-upgraded', {
        detail: { newPlan: newPlanName }
      }));
      
      return true;
      
    } catch (error) {
      console.error('Failed to process plan upgrade:', error);
      return false;
    }
  };

  const completeSurvey = async (surveyId: string) => {
    if (!surveyData || !userId) return false;

    try {
      const survey = surveyData.surveys.find(s => s.id === surveyId);
      if (!survey) return false;

      // Update user progress
      setSurveyData(prev => {
        if (!prev) return null;
        
        const updatedData = {
          ...prev,
          userProgress: {
            ...prev.userProgress,
            surveysCompletedToday: prev.userProgress.surveysCompletedToday + 1,
            totalEarnings: prev.userProgress.totalEarnings + survey.reward,
            pendingEarnings: prev.userProgress.pendingEarnings + survey.reward,
            completedSurveys: [...prev.userProgress.completedSurveys, surveyId]
          }
        };

        // Save to user-specific localStorage
        const storageKey = `surveyData_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        
        return updatedData;
      });

      return true;
    } catch (error) {
      console.error('Failed to complete survey:', error);
      return false;
    }
  };

  return {
    planData,
    surveyData,
    loading,
    getCurrentPlan,
    getAvailableSurveys,
    completeSurvey,
    verifyPaymentAndUpgradePlan,
    upgradePlan,
    verifiedPlan
  };
};
