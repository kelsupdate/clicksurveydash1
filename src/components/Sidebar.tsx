import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { useSurveyData } from "@/hooks/useSurveyData";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState<string>('User');
  const [userEmail, setUserEmail] = useState<string>('');
  const { surveyData, planData } = useSurveyData();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
        setUserEmail(user.email || '');
      }
    };
    fetchUser();
  }, []);

  const currentPlan = surveyData?.userProgress?.currentPlan || 'Starter';
  const pendingEarnings = surveyData?.userProgress?.pendingEarnings || 0;
  
  // Get plan limits from centralized plan.json
  const surveyLimit = planData?.limits?.survey?.[currentPlan] || 1;
  const withdrawalLimit = planData?.limits?.withdrawal?.[currentPlan] || 4500;
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: currentPath === "/dashboard"
    },
    {
      title: "Plans",
      icon: Star,
      href: "/plans",
      active: currentPath === "/plans"
    },
    {
      title: "Available Surveys",
      icon: FileText,
      href: "/surveys",
      badge: "12",
      active: currentPath === "/surveys"
    },
    {
      title: "My Earnings",
      icon: DollarSign,
      href: "/earnings",
      active: currentPath === "/earnings"
    },
    {
      title: "Referrals",
      icon: Users,
      href: "/referrals",
      badge: "3",
      active: currentPath === "/referrals"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      active: currentPath === "/settings"
    }
  ];

  // Handle body scroll lock on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isSidebarOpen]);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && isSidebarOpen) {
        closeSidebar();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, isSidebarOpen, closeSidebar]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="mobile-overlay active"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      <div className={cn(
        "sidebar-glass sidebar-enhanced border-r transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        isMobile && isSidebarOpen && "mobile-open"
      )}>
        {/* Header */}
        <div className="sidebar-logo p-4">
          <div className="flex items-center justify-between">
            {!isMobile && !isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="sidebar-logo-icon w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <span className="font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  SurveyDash
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={isMobile ? closeSidebar : () => setIsCollapsed(!isCollapsed)}
              className="hover:bg-transparent"
              aria-label={isMobile ? "Close sidebar" : "Toggle sidebar"}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* User Info */}
        {!isCollapsed && (
          <div className="sidebar-user-info p-4">
            <div className="flex items-center gap-3">
              <div className="sidebar-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{currentPlan} Plan</p>
              </div>
            </div>
            <div className="sidebar-earnings mt-3 p-2 rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-semibold text-primary">KSh {pendingEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className={cn(
                    "sidebar-nav-button w-full justify-start gap-3 h-10",
                    item.active && "sidebar-nav-button active",
                    isCollapsed && "justify-center px-0"
                  )}
                  onClick={() => {
                    if (isMobile) {
                      closeSidebar();
                    }
                    window.location.href = item.href;
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="sidebar-badge text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-logout p-4">
          <Button
            variant="ghost"
            className={cn(
              "sidebar-logout-button w-full justify-start gap-3 text-muted-foreground",
              isCollapsed && "justify-center px-0"
            )}
            onClick={async () => {
              // Only clear auth-related data, preserve survey data
              localStorage.removeItem('sb-refresh-token');
              localStorage.removeItem('sb-access-token');
              localStorage.removeItem('supabase.auth.token');
              
              // Sign out from Supabase
              await supabase.auth.signOut();
              if (isMobile) {
                closeSidebar();
              }
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
