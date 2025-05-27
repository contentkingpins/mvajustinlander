/**
 * Hero Section with parallax scrolling and conversion-focused design
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/Button';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { trackConversion, trackEvent } = useTracking();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    // Scroll to form or open modal
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center bg-cover" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={ref}
        className="relative z-10 container mx-auto px-4 text-center text-white"
        style={{ opacity }}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Available 24/7 for Free Consultation</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Injured in an Accident?
          <br />
          <span className="text-yellow-400">Get Maximum Compensation</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          No fees unless we win. Our experienced attorneys have recovered over{' '}
          <span className="font-bold text-yellow-400">$500 million</span> for injury victims.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button
            size="xl"
            variant="primary"
            onClick={handleFormStart}
            className="min-w-[250px] bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            icon={<ArrowRight className="ml-2" />}
          >
            Get Free Case Review
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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">$500M+</div>
            <div className="text-sm text-gray-300">Recovered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">2,500+</div>
            <div className="text-sm text-gray-300">Cases Won</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">No Fee</div>
            <div className="text-sm text-gray-300">Unless We Win</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">4.9★</div>
            <div className="text-sm text-gray-300">Client Rating</div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 1,
          }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float-slow opacity-20">
        <div className="w-20 h-20 bg-yellow-400 rounded-full blur-xl" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float-medium opacity-20">
        <div className="w-32 h-32 bg-blue-400 rounded-full blur-xl" />
      </div>
    </section>
  );
};

// Add custom Window interface for Intercom
declare global {
  interface Window {
    Intercom?: any;
  }
} 