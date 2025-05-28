/**
 * Sticky Header Component
 * Fixed header that appears on scroll with call and chat buttons
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';
import { useBusinessHours } from '@/components/tracking/BusinessHoursDetector';

export const StickyHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const { trackConversion } = useTracking();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    const checkBusinessHours = () => {
      const now = new Date();
      const hours = now.getHours();
      const day = now.getDay();
      
      // Business hours: Mon-Fri 9AM-6PM
      const isWeekday = day >= 1 && day <= 5;
      const isDuringBusinessHours = hours >= 9 && hours < 18;
      
      setIsBusinessHours(isWeekday && isDuringBusinessHours);
    };

    window.addEventListener('scroll', handleScroll);
    checkBusinessHours();
    
    // Check business hours every minute
    const interval = setInterval(checkBusinessHours, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handlePhoneClick = () => {
    trackConversion({
      type: ConversionType.PHONE_CLICK,
      metadata: { 
        location: 'sticky_header',
        businessHours: isBusinessHours 
      }
    });
    window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b-2 border-blue-200"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-900">Claim Connectors</h1>
              </div>

              {/* Call Button */}
              <button
                onClick={handlePhoneClick}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ${
                  isBusinessHours
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                aria-label="Call now"
              >
                <Phone className="w-5 h-5" />
                <span className="hidden sm:inline">Call Now: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}</span>
                <span className="sm:hidden">Call Now</span>
              </button>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}; 