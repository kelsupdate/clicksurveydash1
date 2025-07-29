import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  FileText, 
  Settings, 
  Star,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import { useSurveyData, Survey } from "@/hooks/useSurveyData";
import SurveyQuestion from "./SurveyQuestion";
import WithdrawalContainer from "./WithdrawalContainer";
import ReferralCodeInput from "@/components/ReferralCodeInput";

const Dashboard = () => {
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const { toast } = useToast();
  const { planData, surveyData, loading, getCurrentPlan, getAvailableSurveys, completeSurvey } = useSurveyData();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      }
    };
    fetchUser();
  }, []);

  const handleSurveyComplete = async (surveyId: string) => {
    completeSurvey(surveyId);
    setCurrentSurvey(null);
    toast({
      title: "Survey Completed! 🎉",
      description: `You earned KSh ${surveyData?.surveys.find(s => s.id === surveyId)?.reward}! Keep it up!`,
    });
  };

  const handleSurveyCancel = () => {
    setCurrentSurvey(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 ml-[240px]">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!planData || !surveyData) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 ml-[240px]">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-800">Data Loading Error</h3>
                <p className="text-red-700 mt-2">
                  Could not load dashboard data. Please refresh the page or try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentPlan = getCurrentPlan();
  const availableSurveys = getAvailableSurveys();
  const userProgress = surveyData.userProgress;

  const stats = [
    {
      title: "Total Earnings",
      value: `KSh ${userProgress.totalEarnings.toLocaleString()}`,
      change: `+KSh ${userProgress.pendingEarnings}`,
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Surveys Completed",
      value: userProgress.completedSurveys.length.toString(),
      change: `${userProgress.surveysCompletedToday} today`,
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Current Plan",
      value: currentPlan?.planName || "No Plan",
      change: `${currentPlan?.dailySurvey || 0} daily limit`,
      icon: TrendingUp,
      color: "text-accent"
    },
    {
      title: "Referrals",
      value: userProgress.referrals.totalReferrals.toString(),
      change: `KSh ${userProgress.referrals.referralEarnings}`,
      icon: Users,
      color: "text-warning"
    }
  ];

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
        description: `You've completed your daily limit of ${currentPlan.dailySurvey} surveys.`,
        variant: "destructive"
      });
      return;
    }

    const survey = surveyData.surveys.find(s => s.id === surveyId);
    if (!survey) return;
    
    setCurrentSurvey(survey);
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(userProgress.referrals.referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handleWithdrawal = () => {
    if (userProgress.pendingEarnings < (currentPlan?.minimumWithdrawal || 0)) {
      toast({
        title: "Insufficient Balance",
        description: `You need KSh ${(currentPlan?.minimumWithdrawal || 0) - userProgress.pendingEarnings} more to withdraw`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdrawal Request Submitted",
      description: "Your withdrawal will be processed within 24 hours",
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-dashboard">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8 ml-[240px]">
        {currentSurvey ? (
          <SurveyQuestion
            questions={currentSurvey.questions || []}
            surveyId={currentSurvey.id}
            reward={currentSurvey.reward}
            title={currentSurvey.title}
            duration={currentSurvey.duration}
            onComplete={handleSurveyComplete}
            onCancel={handleSurveyCancel}
          />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome back, {userName}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's your survey dashboard overview
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-soft hover:shadow-glow transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-success mt-1">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Referral Code Section */}
            <div className="mb-8">
              <ReferralCodeInput />
            </div>

            {/* Rest of the dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Available Surveys */}
              <div className="lg:col-span-2">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-accent" />
                      Available Surveys
                    </CardTitle>
                    <CardDescription>
                      Complete surveys to earn money
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availableSurveys.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0) 
                            ? "You've completed all surveys for today! Come back tomorrow." 
                            : "No surveys available for your current plan. Consider upgrading!"}
                        </p>
                        {userProgress.surveysCompletedToday < (currentPlan?.dailySurvey || 0) && (
                          <Button variant="outline" onClick={() => window.location.href = '/plans'}>
                            View Plans
                          </Button>
                        )}
                      </div>
                    ) : (
                      availableSurveys.map((survey) => (
                        <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold">{survey.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{survey.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>⏱️ {survey.duration}</span>
                              <Badge variant="secondary">{survey.category}</Badge>
                              <Badge variant={survey.difficulty === "Easy" ? "default" : "secondary"}>
                                {survey.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                Requires {survey.requiredPlan}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-primary">KSh {survey.reward}</div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-gradient-primary hover:opacity-90"
                              onClick={() => handleStartSurvey(survey.id)}
                              disabled={userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0)}
                            >
                              {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0) ? 'Limit Reached' : 'Start Survey'}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest surveys
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userProgress.completedSurveys.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No surveys completed yet</p>
                    ) : (
                      userProgress.completedSurveys.slice(-3).map((surveyId, index) => {
                        const survey = surveyData.surveys.find(s => s.id === surveyId);
                        if (!survey) return null;
                        
                        return (
                          <div key={surveyId} className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{survey.title}</p>
                                <p className="text-xs text-muted-foreground">Recently completed</p>
                              </div>
                              <Badge variant="default" className="text-xs">
                                Completed
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-success">KSh {survey.reward}</span>
                            </div>
                            {index < userProgress.completedSurveys.slice(-3).length - 1 && <hr className="border-border" />}
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>

                {/* Withdrawal Container */}
                <WithdrawalContainer />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
