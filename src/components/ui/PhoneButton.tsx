/**
 * Floating Phone Button
 * Shows different states based on business hours
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useBusinessHours } from '@/components/tracking/BusinessHoursDetector';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';

export const PhoneButton: React.FC = () => {
  const { isBusinessHours, nextOpenTime } = useBusinessHours();
  const { trackConversion } = useTracking();

  const handleClick = () => {
    trackConversion({
      type: ConversionType.PHONE_CLICK,
      metadata: { 
        location: 'floating_button',
        businessHours: isBusinessHours 
      }
    });
    
    window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`;
  };

  const formatNextOpenTime = () => {
    if (!nextOpenTime) return '';
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    });
    return formatter.format(nextOpenTime);
  };

  return (
    <motion.div
      className="fixed bottom-24 left-4 z-90"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
    >
      <motion.button
        onClick={handleClick}
        className={`
          relative flex items-center gap-3 px-6 py-4 rounded-full shadow-lg
          ${isBusinessHours 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
          }
          transition-all duration-300 group
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse animation for business hours */}
        {isBusinessHours && (
          <motion.div
            className="absolute -inset-1 bg-green-600 rounded-full opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        <Phone className="w-5 h-5" />
        
        <div className="text-left">
          <div className="font-bold text-sm">
            {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
          </div>
          <div className="text-xs opacity-90">
            {isBusinessHours ? 'Call Now - We\'re Open!' : `Opens ${formatNextOpenTime()}`}
          </div>
        </div>

        {/* Hover tooltip */}
        <motion.div
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
        >
          {isBusinessHours ? 'Click to call now' : 'Click to schedule callback'}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}; 