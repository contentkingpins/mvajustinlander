/**
 * Sticky Header Component
 * Floating header with quick access to phone and form
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, FileText, X } from 'lucide-react';
import { useFormModal } from '@/providers/FormProvider';
import { deviceUtils, formatPhoneNumber } from '@/lib/utils';

export const StickyHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { openModal } = useFormModal();

  useEffect(() => {
    const handleScroll = () => {
      // Lower threshold for mobile - show header after just 50px of scrolling
      const scrolled = window.scrollY > 50;
      setIsVisible(scrolled);
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePhoneClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567';
    deviceUtils.handlePhoneClick(phoneNumber);
  };

  // Ensure we always have a phone number to display
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567';
  const displayPhone = formatPhoneNumber(businessPhone);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-blue-900 shadow-lg"
        style={{ zIndex: 9999 }} // Ensure it's always on top
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Value Proposition Text - Replace Logo */}
            <div className="text-white font-medium text-sm sm:text-base">
              <span className="hidden sm:inline">No Fees Unless We Win</span>
              <span className="sm:hidden">24/7 Free Help</span>
            </div>

            {/* Action Buttons */}
            {!isMinimized && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2.5 rounded-lg transition-colors min-h-[44px] font-bold text-sm shadow-lg"
                  aria-label="Call now"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Call Now</span>
                </button>

                <button
                  onClick={openModal}
                  className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-3 sm:px-4 py-2.5 rounded-lg transition-colors font-bold min-h-[44px] text-sm shadow-lg"
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Free Review</span>
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:text-blue-200 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center ml-1"
                  aria-label="Minimize header"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <motion.button
                onClick={() => setIsMinimized(false)}
                className="text-yellow-400 hover:text-yellow-300 transition-colors font-bold min-h-[44px] text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⚡ Get Help Now
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 