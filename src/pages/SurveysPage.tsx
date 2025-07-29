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
import SurveyLimitModal from "@/components/SurveyLimitModal";

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
  const [showLimitModal, setShowLimitModal] = useState(false);

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
      // Show modal instead of toast and redirect
      setShowLimitModal(true);
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

  const handleSurveyComplete = (surveyId: string, answers: Record<string, string>) => {
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
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-[240px] mt-12 md:mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Available Surveys</h1>
        {availableSurveys.length === 0 ? (
          <p className="text-muted-foreground text-center md:text-left">
            {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0) 
              ? "You've completed all surveys for today! Come back tomorrow." 
              : "No surveys available for your current plan. Consider upgrading!"}
          </p>
        ) : (
          <div className="space-y-4">
            {availableSurveys.map((survey) => (
              <Card key={survey.id} className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg md:text-xl">{survey.title}</CardTitle>
                  <CardDescription className="text-sm">{survey.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm mb-2">Duration: {survey.duration}</p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      <Badge variant="secondary" className="text-xs">{survey.category}</Badge>
                      <Badge variant={survey.difficulty === "Easy" ? "default" : "secondary"} className="text-xs">
                        {survey.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">Requires {survey.requiredPlan}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <p className="font-bold text-primary text-lg">KSh {survey.reward}</p>
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:opacity-90 w-full md:w-auto"
                      onClick={() => {
                        if (userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0)) {
                          setShowLimitModal(true);
                        } else {
                          handleStartSurvey(survey.id);
                        }
                      }}
                    >
                      {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0) ? 'Limit Reached' : 'Start Survey'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SurveyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentPlanName={currentPlan?.planName || "Free"}
        dailyLimit={currentPlan?.dailySurvey || 0}
        surveysCompletedToday={userProgress.surveysCompletedToday}
      />
    </div>
  );
};

export default SurveysPage;
