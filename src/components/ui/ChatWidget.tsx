/**
 * Chat Widget Component
 * Placeholder for chat integration (Intercom, Drift, etc.)
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useBusinessHours } from '@/components/tracking/BusinessHoursDetector';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isBusinessHours } = useBusinessHours();
  const { trackConversion } = useTracking();

  const handleToggle = () => {
    if (!isOpen) {
      trackConversion({
        type: ConversionType.CHAT_START,
        metadata: { businessHours: isBusinessHours }
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-8 right-24 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-90"
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window Placeholder */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-90 flex flex-col"
        >
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-bold">Live Chat</h3>
            <p className="text-sm opacity-90">
              {isBusinessHours ? "We're online!" : "Leave a message"}
            </p>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
            <p className="text-center">
              Chat widget integration goes here.<br/>
              (Intercom, Drift, Zendesk, etc.)
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}; 