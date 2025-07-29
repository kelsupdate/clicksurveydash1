import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, CheckCircle, Shield, Clock } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: DollarSign,
      title: "High Paying Surveys",
      description: "Earn up to KSh 300 per survey with our premium partners"
    },
    {
      icon: TrendingUp,
      title: "Fast Processing",
      description: "Get payments within 24-48 hours of withdrawal request"
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Join 10,000+ active users earning money daily"
    },
    {
      icon: CheckCircle,
      title: "Easy Navigation",
      description: "User-friendly interface makes it simple to complete surveys"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with bank-level security"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated support team"
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What makes SurveyDash stand out</h2>
          <p className="text-xl text-muted-foreground">Features that set us apart from the competition</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
