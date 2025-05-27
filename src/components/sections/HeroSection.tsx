/**
 * Hero Section with optimized animations and conversion-focused design
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { AccidentForm } from '@/components/forms/AccidentForm';

export const HeroSection: React.FC = () => {
  const { trackConversion } = useTracking();
  const heroRef = useRef<HTMLElement>(null);
  const [showAccidentForm, setShowAccidentForm] = useState(false);

  const handlePhoneClick = () => {
    trackConversion({
      type: ConversionType.PHONE_CLICK,
      metadata: { location: 'hero' }
    });
    window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`;
  };

  const handleChatClick = () => {
    trackConversion({
      type: ConversionType.CHAT_START,
      metadata: { location: 'hero' }
    });
    // Open chat widget
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  const handleFormStart = () => {
    trackConversion({
      type: ConversionType.FORM_START,
      metadata: { location: 'hero' }
    });
    setShowAccidentForm(true);
  };

  return (
    <>
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Optimized Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Available 24/7 for Free Consultation</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Injured in an Accident?
            <br />
            <span className="text-yellow-400">Get Maximum Compensation</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            We connect you to top injury attorneys who have recovered over{' '}
            <span className="font-bold text-yellow-400">$500 million</span> for accident victims. No fees unless they win.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Button
              size="xl"
              variant="primary"
              onClick={handleFormStart}
              className="min-w-[250px] bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              icon={<ArrowRight className="ml-2" />}
            >
              Tell Us What Happened
            </Button>

            <Button
              size="xl"
              variant="outline"
              onClick={handlePhoneClick}
              className="min-w-[250px] border-2 border-white text-white hover:bg-white hover:text-blue-900"
              icon={<Phone className="ml-2" />}
            >
              Call Now: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
            </Button>

            <Button
              size="xl"
              variant="outline"
              onClick={handleChatClick}
              className="min-w-[250px] border-2 border-white text-white hover:bg-white hover:text-blue-900 md:hidden lg:inline-flex"
              icon={<MessageCircle className="ml-2" />}
            >
              Live Chat
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">$500M+</div>
              <div className="text-sm text-blue-100">Recovered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">2,500+</div>
              <div className="text-sm text-blue-100">Cases Won</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">No Fee</div>
              <div className="text-sm text-blue-100">Unless We Win</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">4.9★</div>
              <div className="text-sm text-blue-100">Client Rating</div>
            </div>
          </motion.div>

          {/* Simple Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accident Form Modal */}
      <AccidentForm 
        isOpen={showAccidentForm} 
        onClose={() => setShowAccidentForm(false)} 
      />
    </>
  );
};

// Add custom Window interface for Intercom
declare global {
  interface Window {
    Intercom?: any;
  }
} 