/**
 * Hero Section Component
 * Main landing section with headline, CTA, and trust indicators
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFormModal } from '@/providers/FormProvider';
import { deviceUtils, formatPhoneNumber } from '@/lib/utils';

export const HeroSection: React.FC = () => {
  const { openModal } = useFormModal();

  const handlePhoneClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567';
    deviceUtils.handlePhoneClick(phoneNumber);
  };

  const trustIndicators = [
    { icon: Shield, text: 'No Fee Unless We Win' },
    { icon: Clock, text: '24/7 Free Consultation' },
    { icon: DollarSign, text: 'Maximum Compensation' },
  ];

  const displayPhone = formatPhoneNumber(process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567');

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Injured in an Accident?
            <span className="block text-yellow-400 mt-2">Get the Compensation You Deserve</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with top-rated attorneys who fight for maximum compensation. 
            No fees unless we win your case.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              variant="primary"
              onClick={openModal}
              className="text-lg px-8 py-4 min-h-[44px]"
            >
              Get Free Case Review
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={handlePhoneClick}
              className="text-lg px-8 py-4 bg-white text-blue-900 hover:bg-blue-50 min-h-[44px]"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now: {displayPhone}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-blue-100">
                <item.icon className="w-6 h-6 text-yellow-400" />
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}; 