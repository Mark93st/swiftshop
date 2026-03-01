'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleEssentialOnly = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    setIsVisible(false);
    
    // Dispatch the custom event
    window.dispatchEvent(new CustomEvent('cookies_accepted'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-center pointer-events-none">
      <div className="w-full max-w-4xl pointer-events-auto bg-slate-900 text-slate-50 rounded-xl shadow-2xl border border-slate-800 p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-slate-800 p-2.5 rounded-lg hidden sm:block mt-0.5">
            <Cookie className="h-5 w-5 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-relaxed">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. 
              Read more in our{' '}
              <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEssentialOnly}
            className="text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 sm:w-32"
          >
            Essential Only
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAcceptAll}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold sm:w-32"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
