import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Nairobi",
      rating: 5,
      text: "SurveyDash has been a game-changer for me. I make extra money during my free time and the payouts are always on time!",
      avatar: "SM"
    },
    {
      name: "John K.",
      location: "kitale",
      rating: 5,
      text: "I’ve tried many survey apps, but SurveyDash stands out. The more surveys I take, the more I earn. Plus, the withdrawal process is super smooth!",
      avatar: "JK"
    },
    {
      name: "Grace W.",
      location: "Kirinyaga",
      rating: 5,
      text: "Easy to use platform with great customer support. The M-Pesa withdrawals are super convenient and fast!",
      avatar: "GW"
    },
    {
      name: "Michael T.",
      location: "Nakuru",
      rating: 5,
      text: "Finally, a survey site that respects my time AND pays fairly. No scams, no delays—just real money sent straight to my mobile wallet. Highly recommend!",
      avatar: "MT"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What our users say</h2>
          <p className="text-xl text-muted-foreground">Real stories from real earners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-soft hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
