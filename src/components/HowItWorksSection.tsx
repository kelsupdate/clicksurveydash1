import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, ClipboardList, CreditCard, ArrowRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign up for free",
      description: "Registration takes less than 2 minutes and you can start taking surveys right away.",
      step: 1
    },
    {
      icon: ClipboardList,
      title: "Answer surveys",
      description: "Complete surveys from our partners and earn money for each completed survey.",
      step: 2
    },
    {
      icon: CreditCard,
      title: "Withdraw money",
      description: "Cash out your earnings through M-Pesa or bank transfer when you reach the threshold.",
      step: 3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How to earn money with surveys?</h2>
          <p className="text-xl text-muted-foreground">Three simple steps to start earning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <step.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Start Earning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
