/**
 * Sticky Header Component
 * Fixed header that appears on scroll with call and chat buttons
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';
import { useBusinessHours } from '@/components/tracking/BusinessHoursDetector';

export const StickyHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { trackConversion } = useTracking();
  const { isBusinessHours } = useBusinessHours();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleChatClick = () => {
    trackConversion({
      type: ConversionType.CHAT_START,
      metadata: { 
        location: 'sticky_header',
        businessHours: isBusinessHours 
      }
    });
    // TODO: Implement chat functionality
    console.log('Chat clicked');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-slate-900">Claim Connectors</h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Chat Button */}
                <button
                  onClick={handleChatClick}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition-colors"
                  aria-label="Start live chat"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Live Chat</span>
                </button>

                {/* Call Button */}
                <button
                  onClick={handlePhoneClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    isBusinessHours
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  aria-label="Call now"
                >
                  <Phone className="w-5 h-5" />
                  <span className="hidden sm:inline">Call Now</span>
                  <span className="sm:hidden">Call</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}; 