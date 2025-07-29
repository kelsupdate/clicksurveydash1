import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            We're here to help you succeed. Reach out to us anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-lg">support@surveyDash.co.ke</p>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300"
                asChild
              >
                <a href="mailto:support@surveyearn.co.ke">Send Email</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 text-lg">+254 700 323 456</p>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-300"
                asChild
              >
                <a href="tel:+254700123456">Call Now</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg">
            Our support team is available 24/7 to assist you with any questions or concerns.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
