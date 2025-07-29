import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How much can I earn per survey?",
      answer: "Your earnings per survey depend on two factors:\n\nYour plan level (higher-tier plans offer higher-paying surveys).\n\nSurvey difficulty (harder surveys pay more than easier ones).\n\nUpgrade your plan to maximize your earnings!"
    },
    {
      question: "How do I get paid?",
      answer: "We pay via mobile money, with M-Pesa as our preferred method. Once you reach the minimum withdrawal threshold, you can cash out your earnings directly to your mobile wallet."
    },
    {
      question: "Is SurveyDash free to join?",
      answer: "Yes! Joining SurveyDash is completely free. However, upgrading your plan unlocks more surveys and higher earning potential."
    },
    {
      question: "How often will I receive surveys?",
      answer: "The number of surveys you receive daily depends on your upgrade plan. Higher-tier plans get more survey opportunities."
    },
    {
      question: "What are the minimum withdrawal requirements?",
      answer: "The minimum withdrawal amount depends on your plan level. Check your account dashboard for specific details on your withdrawal limit."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely! We only want your thoughts—not your private data. We do not collect or misuse sensitive personal information. Your responses are kept secure and anonymous."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Everything you need to know about SurveyDash</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-soft">
                <CardHeader>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </CardHeader>
                {openFAQ === index && (
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
