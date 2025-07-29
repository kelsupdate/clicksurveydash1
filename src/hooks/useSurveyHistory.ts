import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SurveyRecord {
  id: string;
  completedAt: string;
  amount: number;
  surveyName: string;
}

export const useSurveyHistory = () => {
  const [surveyHistory, setSurveyHistory] = useState<SurveyRecord[]>([]);

  const addSurveyRecord = (survey: {
    id: string;
    surveyName: string;
    amount: number;
  }) => {
    const record: SurveyRecord = {
      ...survey,
      completedAt: new Date().toISOString()
    };

    // Save to localStorage
    const saveToLocalStorage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const storageKey = `surveyHistory_${user.id}`;
        const existing = localStorage.getItem(storageKey);
        const existingRecords: SurveyRecord[] = existing ? JSON.parse(existing) : [];
        
        const updatedRecords = [...existingRecords, record];
        localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
        setSurveyHistory(updatedRecords);
      }
    };

    saveToLocalStorage();
  };

  const getSurveyHistory = async (): Promise<SurveyRecord[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const storageKey = `surveyHistory_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  };

  const clearSurveyHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const storageKey = `surveyHistory_${user.id}`;
      localStorage.removeItem(storageKey);
      setSurveyHistory([]);
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getSurveyHistory();
      setSurveyHistory(history);
    };
    loadHistory();
  }, []);

  return {
    surveyHistory,
    addSurveyRecord,
    getSurveyHistory,
    clearSurveyHistory
  };
};
