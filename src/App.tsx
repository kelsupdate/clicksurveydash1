 import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ReferralProvider } from "./contexts/ReferralContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardPage from "./pages/DashboardPage";
import PlansPage from "./pages/PlansPage";
import ReferralsPage from "./pages/ReferralsPage";
import SettingsPage from "./pages/SettingsPage";
import EarningsPage from "./pages/EarningsPage";
import SurveysPage from "./pages/SurveysPage";
import TermsPage from "./pages/TermsPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import { SampleDataGenerator } from "./components/SampleDataGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SidebarProvider>
        <ReferralProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SampleDataGenerator>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/plans" element={
                    <ProtectedRoute>
                      <PlansPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/referrals" element={
                    <ProtectedRoute>
                      <ReferralsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/earnings" element={
                    <ProtectedRoute>
                      <EarningsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/surveys" element={
                    <ProtectedRoute>
                      <SurveysPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SampleDataGenerator>
          </TooltipProvider>
        </ReferralProvider>
      </SidebarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
