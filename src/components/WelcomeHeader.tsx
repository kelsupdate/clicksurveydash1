import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

interface WelcomeHeaderProps {
  onNavigate: (section: string) => void;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-xl supports-[backdrop-filter]:bg-white/5 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-2 rounded-lg shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">SurveyDash</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => onNavigate('home')} className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600 hover:scale-105">Home</button>
            <button onClick={() => onNavigate('features')} className="text-sm font-medium text-gray-700 transition-all hover:text-indigo-600 hover:scale-105">Features</button>
            <button onClick={() => onNavigate('how-it-works')} className="text-sm font-medium text-gray-700 transition-all hover:text-cyan-600 hover:scale-105">How It Works</button>
            <button onClick={() => onNavigate('testimonials')} className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600 hover:scale-105">Testimonials</button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50/50">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-md hover:shadow-lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader;
