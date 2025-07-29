import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeHero: React.FC = () => {
  return (
    <section id="home" className="py-20 px-4 relative overflow-hidden">
      {/* Background Glass Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 to-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-bl from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Floating Glass Cards */}
      <div className="absolute top-20 left-10 w-32 h-32 glass rounded-2xl animate-float hidden lg:block">
        <div className="flex items-center justify-center h-full">
          <TrendingUp className="w-8 h-8 text-purple-600" />
        </div>
      </div>
      <div className="absolute bottom-20 right-10 w-28 h-28 glass rounded-2xl animate-float animation-delay-3000 hidden lg:block">
        <div className="flex items-center justify-center h-full">
          <Award className="w-7 h-7 text-cyan-600" />
        </div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <Badge className="mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-lg backdrop-blur-sm glass">
          <Star className="h-3 w-3 mr-1" />
          Trusted by 10,000+ users
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
          Earn From Your
          <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mt-2">
            Valuable Opinions
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Get up to Ksh 300 per survey. Free and easy to join, earn and have fun with quick payouts via M-Pesa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-700 hover:via-indigo-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl text-lg px-8 py-6 transition-all duration-300 transform hover:scale-105">
              Start Earning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 h-11 rounded-md px-8 text-lg"
          >
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              10K+
            </div>
            <div className="text-gray-600 font-medium mt-2">Active Users</div>
          </div>
          <div className="text-center glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
              50K+
            </div>
            <div className="text-gray-600 font-medium mt-2">Surveys Done</div>
          </div>
          <div className="text-center glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-center mb-4">
              <Award className="w-8 h-8 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              2M+
            </div>
            <div className="text-gray-600 font-medium mt-2">Paid Out</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeHero;
