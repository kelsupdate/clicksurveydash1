import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WelcomeFooter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="border-t border-gray-200 py-16 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                SurveyDash
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Earn money from your opinions with Kenya's most trusted survey platform. 
              Join thousands of users earning daily.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:support@surveyearn.co.ke" className="hover:text-blue-400 transition-colors">
                  support@surveyDash.co.ke
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-purple-400" />
                <a href="tel:+254700123456" className="hover:text-purple-400 transition-colors">
                  +254 700 323 456
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  How it Works
                </button>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-gray-300 hover:text-blue-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg text-white">Stay Updated</h4>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to get notified about new surveys and earning opportunities.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2025 SurveyDash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default WelcomeFooter;
