import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | SwiftShop',
  description: 'Our commitment to protecting your privacy and personal data.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Privacy & Cookie Policy</h1>
            <p className="text-slate-500">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-blue-600" />
                1. Introduction
              </h2>
              <p>
                Welcome to SwiftShop. We are committed to protecting your personal data and your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you visit 
                our website and make purchases. As a company operating within the European Union, we comply 
                with the General Data Protection Regulation (GDPR).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                2. Data We Collect
              </h2>
              <p>We collect personal information that you provide directly to us. This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                <li><strong>Financial Data:</strong> Payment card details (processed securely via Stripe).</li>
                <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased from us.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-blue-600" />
                3. How We Use Your Data
              </h2>
              <p>We use your data for the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Performance of a Contract:</strong> To process and deliver your order.</li>
                <li><strong>Consent:</strong> For marketing communications and certain types of cookies.</li>
                <li><strong>Legitimate Interests:</strong> To improve our website and provide a better shopping experience.</li>
              </ul>
            </section>

            <section className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. Cookie Policy</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Essential Cookies</h3>
                  <p className="text-sm">These are necessary for the website to function, such as maintaining your shopping cart and account security. They cannot be switched off.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Analytics & Marketing</h3>
                  <p className="text-sm">With your consent, we use Google Analytics to understand how visitors interact with the site. We use this data to improve our products and services.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. Your Rights (GDPR)</h2>
              <p>Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access your personal data.</li>
                <li>The right to rectification of inaccurate data.</li>
                <li>The right to erasure ("the right to be forgotten").</li>
                <li>The right to withdraw consent at any time (e.g., via our cookie banner).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at:
              </p>
              <p className="mt-2 font-medium text-slate-900">
                Email: privacy@swiftshop.com<br />
                Address: 123 Tech Avenue, Berlin, Germany
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
