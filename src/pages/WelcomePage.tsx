import React from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';
import WelcomeHero from '@/components/WelcomeHero';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import WelcomeFooter from '@/components/WelcomeFooter';

const WelcomePage: React.FC = () => {
  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Glass Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-cyan-900/20"></div>
        
        {/* Animated glass layers */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 animate-gradient-shift"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-600/5 via-transparent to-teal-600/5 animate-gradient-shift animation-delay-2000"></div>
        </div>

        {/* Floating glass elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 to-teal-500/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-bl from-cyan-500/15 to-purple-500/15 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        
        {/* Glass grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <WelcomeHeader onNavigate={handleNavigate} />
        <main>
          <WelcomeHero />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FAQSection />
          <ContactSection />
        </main>
        <WelcomeFooter />
      </div>
    </div>
  );
};

export default WelcomePage;
