import { useSurveyData } from "@/hooks/useSurveyData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import WithdrawalContainer from "@/components/WithdrawalContainer";
import SavedPhoneNumber from "@/components/SavedPhoneNumber";
import SurveyEarningsChart from "@/components/SurveyEarningsChart";

const EarningsPage = () => {
  const { surveyData } = useSurveyData();

  if (!surveyData) return null;

  const userProgress = surveyData.userProgress;

  return (
    <div className="min-h-screen w-full bg-earnings">
      <Header />
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px] mt-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-text bg-clip-text text-transparent">My Earnings</h1>
        
        <div className="space-y-6 md:space-y-8">
          {/* Top Section - Charts and Stats */}
          <div className="w-full">
            {/* Earnings Overview - Mobile Optimized */}
            <Card className="earnings-card mb-4 md:mb-6">
              <CardHeader>
                <CardTitle className="text-lg md:text-2xl font-bold text-foreground">Total Earnings</CardTitle>
                <CardDescription className="text-sm md:text-base text-foreground/80">Your total earnings from surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl md:text-3xl font-bold text-primary">KSh {userProgress.totalEarnings.toLocaleString()}</p>
                <p className="text-sm md:text-base text-foreground/70 mt-2">
                  Pending Earnings: KSh {userProgress.pendingEarnings.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Survey Performance Chart */}
            <SurveyEarningsChart />
          </div>

          {/* Bottom Section - Withdrawal Area */}
          <div className="w-full space-y-4 md:space-y-6">
            {/* Saved Phone Number */}
            <SavedPhoneNumber />
            
            {/* Withdrawal Container */}
            <WithdrawalContainer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EarningsPage;
