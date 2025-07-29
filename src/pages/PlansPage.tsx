import PlanUpgrade from "@/components/PlanUpgrade";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const PlansPage = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Header />
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-[240px] mt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 overflow-x-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 pointer-events-none" />
        <div className="relative">
          <PlanUpgrade />
        </div>
      </main>
    </div>
  );
};

export default PlansPage;
