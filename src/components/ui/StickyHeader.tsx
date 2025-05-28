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
      const scrolled = window.scrollY > 100;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePhoneClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567';
    deviceUtils.handlePhoneClick(phoneNumber);
  };

  const displayPhone = formatPhoneNumber(process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567');

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-blue-900 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo/Brand */}
            <div className="text-white font-bold text-lg">
              Claim Connectors
            </div>

            {/* Action Buttons */}
            {!isMinimized && (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Call now"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">{displayPhone}</span>
                </button>

                <button
                  onClick={openModal}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-4 py-2 rounded-lg transition-colors font-medium min-h-[44px]"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Free Case Review</span>
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:text-blue-200 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium min-h-[44px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Get Help Now
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 