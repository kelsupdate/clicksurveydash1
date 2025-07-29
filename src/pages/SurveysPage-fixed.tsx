import { useSurveyData } from "@/hooks/useSurveyData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SurveyQuestion from "@/components/SurveyQuestion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";

interface Question {
  id: string;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string | null;
}

interface Survey {
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

const SurveysPage = () => {
  const { surveyData, getCurrentPlan, getAvailableSurveys, completeSurvey } = useSurveyData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeSurvey, setActiveSurvey] = useState<string | null>(null);
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);

  if (!surveyData) return null;

  const currentPlan = getCurrentPlan();
  const availableSurveys = getAvailableSurveys();
  const userProgress = surveyData.userProgress;

  const handleStartSurvey = (surveyId: string) => {
    if (!currentPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please upgrade your plan to access surveys.",
        variant: "destructive"
      });
      return;
    }

    if (userProgress.surveysCompletedToday >= currentPlan.dailySurvey) {
      toast({
        title: "Daily Limit Reached",
        description: `You've completed your daily limit of ${currentPlan.dailySurvey} surveys. Please upgrade your plan to continue.`,
        variant: "destructive"
      });
      navigate("/plans");
      return;
    }

    const survey = surveyData.surveys.find(s => s.id === surveyId);
    if (!survey || !survey.questions) {
      toast({
        title: "Survey Not Available",
        description: "This survey is not available or has no questions.",
        variant: "destructive"
      });
      return;
    }

    setActiveSurvey(surveyId);
    setSurveyQuestions(survey.questions);
  };

  const handleSurveyComplete = async (surveyId: string, answers: Record<string, string>) => {
    // Check if this is the user's first survey completion
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if user was referred
      const { data: referral } = await supabase
        .from('referrals')
        .select('*')
        .eq('referred_email', user.email)
        .eq('status', 'pending')
        .single()
        .catch(() => null);

      if (referral) {
        // Complete the referral
        await supabase
          .from('referrals')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', referral.id);

        // Update referrer stats
        const { data: stats } = await supabase
          .from('user_referral_stats')
          .select('*')
          .eq('user_id', referral.referrer_id)
          .single();

        if (stats) {
          await supabase
            .from('user_referral_stats')
            .update({
              completed_referrals: stats.completed_referrals + 1,
              pending_referrals: stats.pending_referrals - 1,
              total_earned: stats.total_earned + referral.reward_amount
            })
            .eq('user_id', referral.referrer_id);
        }
      }
    }

    completeSurvey(surveyId);
    setActiveSurvey(null);
    setSurveyQuestions([]);
    
    const survey = surveyData.surveys.find(s => s.id === surveyId);
    toast({
      title: "Survey Completed! 🎉",
      description: `You earned KSh ${survey?.reward}! Thank you for your participation.`,
    });
  };

  const handleSurveyCancel = () => {
    setActiveSurvey(null);
    setSurveyQuestions([]);
    toast({
      title: "Survey Cancelled",
      description: "You can return to this survey later.",
      variant: "default"
    });
  };

  if (activeSurvey) {
    const survey = surveyData.surveys.find(s => s.id === activeSurvey);
    return (
      <SurveyQuestion
        questions={surveyQuestions}
        surveyId={activeSurvey}
        reward={survey?.reward || 0}
        title={survey?.title || "Survey"}
        duration={survey?.duration || "5 minutes"}
        onComplete={handleSurveyComplete}
        onCancel={handleSurveyCancel}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-survey">
      <Header />
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-[240px] mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Available Surveys</h1>
        {availableSurveys.length === 0 ? (
          <div className="bg-white/50 rounded-lg p-4 sm:p-6">
            <p className="text-muted-foreground text-center">
              {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0)
                ? "You've completed all surveys for today! Come back tomorrow."
                : "No surveys available for your current plan. Consider upgrading!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableSurveys.map((survey) => (
              <Card key={survey.id} className="survey-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">{survey.title}</CardTitle>
                  <CardDescription className="text-sm">{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Duration: {survey.duration}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{survey.category}</Badge>
                        <Badge variant={survey.difficulty === "Easy" ? "default" : "secondary"} className="text-xs">
                          {survey.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">Requires {survey.requiredPlan}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <p className="font-bold text-primary text-lg">KSh {survey.reward}</p>
                      <Button 
                        size="sm" 
                        className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
                        onClick={() => handleStartSurvey(survey.id)}
                        disabled={userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0)}
                      >
                        {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0) ? 'Limit Reached' : 'Start Survey'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SurveysPage;
