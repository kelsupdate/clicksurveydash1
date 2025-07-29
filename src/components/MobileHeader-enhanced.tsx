import { useState } from "react";
import { Menu, User, LogOut, DollarSign, PanelLeft, MenuIcon, DollarSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  userName?: string;
  userEmail?: string;
  userBalance?: number;
  onLogout?: () => void;
}

export const MobileHeader = ({ onToggleSidebar, userName = "User", userEmail = "user@example.com", userBalance = 0, onLogout }: MobileHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsDropdownOpen(false);
  };

  return (
    <header className="mobile-header fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 shadow-lg">
      <div className="w-full max-w-full px-4 h-16 flex items-center justify-between gap-2">
        {/* Left: Enhanced Sidebar Toggle Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="sidebar-toggle-btn h-10 w-10 p-0 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Toggle sidebar menu"
          >
            <MenuIcon className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Center: Logo/Title */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <DollarSignIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white truncate">
              SurveyDash
            </h1>
          </div>
        </div>

        {/* Right: User Dropdown */}
        <div className="flex-shrink-0">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-white/20 text-white font-semibold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-4 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">Balance</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    KSh {userBalance}
                  </span>
                </div>
              </div>
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
