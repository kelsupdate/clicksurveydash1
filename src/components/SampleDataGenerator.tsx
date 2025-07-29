import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SampleDataGeneratorProps {
  children: React.ReactNode;
}

export const SampleDataGenerator = ({ children }: SampleDataGeneratorProps) => {
  useEffect(() => {
    const generateSampleData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if sample data already exists
      const storageKey = `surveyHistory_${user.id}`;
      const existingData = localStorage.getItem(storageKey);
      
      if (!existingData || JSON.parse(existingData).length === 0) {
        // Generate sample survey completion data for the last 30 days
        const sampleData = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Random number of surveys per day (0-3)
          const surveysPerDay = Math.floor(Math.random() * 4);
          
          for (let j = 0; j < surveysPerDay; j++) {
            const surveyNames = [
              "Customer Satisfaction Survey",
              "Product Feedback Survey",
              "Market Research Study",
              "Brand Awareness Survey",
              "User Experience Survey",
              "Shopping Habits Study",
              "Technology Usage Survey",
              "Lifestyle Preferences"
            ];
            
            const randomSurvey = surveyNames[Math.floor(Math.random() * surveyNames.length)];
            const randomAmount = Math.floor(Math.random() * 61) + 40; // 40-100 KSh
            
            sampleData.push({
              id: `sample-${i}-${j}`,
              surveyName: randomSurvey,
              amount: randomAmount,
              completedAt: date.toISOString()
            });
          }
        }
        
        localStorage.setItem(storageKey, JSON.stringify(sampleData));
        console.log('Sample survey data generated:', sampleData.length, 'records');
      }
    };

    generateSampleData();
  }, []);

  return <>{children}</>;
};
