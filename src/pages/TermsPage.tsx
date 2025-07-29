import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Clock, DollarSign, Users, FileText } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to SurveyEarn ("we," "our," or "us"). These Terms and Conditions govern your use of our survey platform 
              and services. By accessing or using SurveyEarn, you agree to be bound by these terms. If you disagree with any 
              part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Eligibility and Registration
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>You must be at least 18 years old to use our services</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>You must provide accurate and complete registration information</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>You must maintain the security of your account credentials</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>One account per person is allowed</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
              Earnings and Payments
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Survey Compensation:</strong> Users earn between Ksh 50-300 per completed survey based on length and complexity.</p>
              <p><strong>Payment Methods:</strong> All payments are processed via M-Pesa to your registered phone number.</p>
              <p><strong>Minimum Payout:</strong> Minimum withdrawal amount is Ksh 500.</p>
              <p><strong>Payment Schedule:</strong> Payments are processed within 24-48 hours of withdrawal request.</p>
              <p><strong>Tax Responsibility:</strong> Users are responsible for any applicable taxes on earnings.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Survey Participation
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Honest Responses:</strong> You must provide truthful and accurate responses to all survey questions.</p>
              <p><strong>Time Limits:</strong> Surveys must be completed within the specified time frame.</p>
              <p><strong>Quality Standards:</strong> We reserve the right to reject responses that appear rushed, inconsistent, or of poor quality.</p>
              <p><strong>Survey Availability:</strong> Survey availability varies based on demographic requirements and client needs.</p>
              <p><strong>Account Suspension:</strong> Accounts may be suspended for providing false information or violating survey guidelines.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Usage</h2>
            <div className="space-y-4 text-gray-700">
              <p>We collect and process personal data in accordance with our Privacy Policy. Your survey responses may be shared with clients in aggregated, anonymized form.</p>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Creating multiple accounts</li>
              <li>• Using automated tools or bots</li>
              <li>• Providing false demographic information</li>
              <li>• Attempting to manipulate survey results</li>
              <li>• Sharing account access with others</li>
              <li>• Engaging in fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend accounts immediately, without prior notice, for conduct that we believe violates these Terms or is otherwise harmful to our platform or users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at support@surveyearn.com or through our contact page.
            </p>
          </section>

          <div className="text-center pt-8">
            <Link 
              to="/signup" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
