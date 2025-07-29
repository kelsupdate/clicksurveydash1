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
import WithdrawalContainer from "./WithdrawalContainer";
import ReferralCodeInput from "@/components/ReferralCodeInput";
import SurveyLimitModal from "./SurveyLimitModal";
import SurveyQuestion from "@/components/SurveyQuestion";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

const Dashboard = () => {
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
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
        <main className="flex-1 p-6 lg:p-8">
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
        <main className="flex-1 p-6 lg:p-8">
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
      setShowLimitModal(true);
      return;
    }

    const survey = surveyData.surveys.find(s => s.id === surveyId);
    if (!survey) {
      toast({
        title: "Survey Not Available",
        description: "This survey is not available.",
        variant: "destructive"
      });
      return;
    }

    if (!survey.questions || survey.questions.length === 0) {
      toast({
        title: "Survey Error",
        description: "This survey has no questions available.",
        variant: "destructive"
      });
      return;
    }
    
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

  // toggleSidebar and closeSidebar are now from useSidebar context

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className={cn(
        "sidebar-container fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 transition-transform duration-300 ease-in-out"
      )}>
        <Sidebar />
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        "ml-0 md:ml-[240px] mt-12 md:mt-16"
      )}>
        <SurveyLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          currentPlanName={currentPlan?.planName || "No Plan"}
          dailyLimit={currentPlan?.dailySurvey || 0}
          surveysCompletedToday={userProgress.surveysCompletedToday}
        />
        
        {currentSurvey ? (
          <div className="p-4 md:p-6 lg:p-8">
            <SurveyQuestion
              questions={currentSurvey.questions || []}
              surveyId={currentSurvey.id}
              reward={currentSurvey.reward}
              title={currentSurvey.title}
              duration={currentSurvey.duration}
              onComplete={handleSurveyComplete}
              onCancel={handleSurveyCancel}
            />
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            {/* Modern Dashboard Overview */}
            <div className="min-h-screen p-4 md:p-6 lg:p-8">
              {/* Header with Enhanced Styling */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-muted-foreground mt-2 text-base md:text-lg">
                  Your earnings dashboard is looking great today
                </p>
              </div>

              {/* Enhanced Stats Grid with Glass Effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                      <p className="text-sm text-success mt-1">
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

              {/* Outstanding Survey Container */}
              <div className="bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Survey Opportunities
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Discover high-paying surveys tailored for you
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{availableSurveys.length} available</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {availableSurveys.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <Star className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Surveys Available</h3>
                      <p className="text-muted-foreground mb-4">
                        {userProgress.surveysCompletedToday >= (currentPlan?.dailySurvey || 0) 
                          ? "You've completed all surveys for today! Come back tomorrow." 
                          : "No surveys available for your current plan. Consider upgrading!"}
                      </p>
                      {userProgress.surveysCompletedToday < (currentPlan?.dailySurvey || 0) && (
                        <Button 
                          variant="default" 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => window.location.href = '/plans'}
                        >
                          Upgrade Plan
                        </Button>
                      )}
                    </div>
                  ) : (
                    availableSurveys.map((survey) => (
                      <div key={survey.id} className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-xl p-4 md:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-foreground mb-1">{survey.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{survey.description}</p>
                          </div>
                          <div className="ml-4">
                            <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                              KSh {survey.reward}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Badge variant="secondary" className="text-xs">
                            {survey.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {survey.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {survey.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {survey.requiredPlan}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Available now</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity & Earnings Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                        <Award className="h-5 w-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Your latest achievements and earnings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProgress.completedSurveys.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                              <Award className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No surveys completed yet. Start earning today!</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userProgress.completedSurveys.slice(-4).map((surveyId, index) => {
                              const survey = surveyData.surveys.find(s => s.id === surveyId);
                              if (!survey) return null;
                              
                              return (
                                <div key={surveyId} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                                  <div>
                                    <p className="font-semibold text-sm">{survey.title}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-bold text-success">+KSh {survey.reward}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Withdrawal Container */}
                <div>
                  <WithdrawalContainer />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
