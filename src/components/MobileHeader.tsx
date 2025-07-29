import { useState } from "react";
import { Menu, X, User, LogOut, DollarSign } from "lucide-react";
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
    <header className="mobile-header fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="w-full max-w-full px-3 h-14 flex items-center justify-between gap-2">
        {/* Left: Menu Toggle - Fixed width */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-10 w-10 p-0 hover:bg-muted/50 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center: Logo/Title - Flexible width */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-2">
          <h1 className="text-base font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
            SurveyDash
          </h1>
        </div>

        {/* Right: User Dropdown - Fixed width */}
        <div className="flex-shrink-0">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0 hover:bg-muted/50 flex items-center justify-center"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-3 py-4 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm bg-gradient-primary text-white">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">Balance</span>
                  <span className="text-sm font-bold text-primary">KSh {userBalance}</span>
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
