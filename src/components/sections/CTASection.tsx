/**
 * CTA Section
 * Final call-to-action with urgency and social proof
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';

export const CTASection = () => {
  const { trackConversion } = useTracking();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  // Countdown timer for urgency (resets daily)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days: 0, hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handlePhoneClick = () => {
    trackConversion({
      type: ConversionType.PHONE_CLICK,
      metadata: { location: 'final_cta' }
    });
    window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`;
  };

  const handleFormClick = () => {
    trackConversion({
      type: ConversionType.FORM_START,
      metadata: { location: 'final_cta' }
    });
    // Open form modal or scroll to form
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center bg-cover" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-red-500 text-white rounded-full px-6 py-2 mb-6"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Limited Time: Free Case Review Ends Today</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Don't Wait Another Day to Get the
            <span className="block text-yellow-400 mt-2">Money You Deserve</span>
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Every day you wait, evidence disappears and your case gets weaker.
            <span className="block mt-2 font-semibold">Act now before it's too late.</span>
          </p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 min-w-[100px]">
              <div className="text-3xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm text-blue-200">Hours</div>
            </div>
            <div className="flex items-center text-3xl">:</div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 min-w-[100px]">
              <div className="text-3xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm text-blue-200">Minutes</div>
            </div>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-4 mb-10 text-left max-w-3xl mx-auto"
          >
            {[
              'Free Case Evaluation',
              'No Fees Unless We Win',
              'Get Treatment Now, Pay Later',
              '24/7 Availability',
              'Home & Hospital Visits',
              'Se Habla Español',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-blue-100">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8"
          >
            <button
              onClick={handlePhoneClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-5 px-10 rounded-lg text-xl transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl"
            >
              <Phone className="w-6 h-6" />
              Call Now: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
            </button>

            <button
              onClick={handleFormClick}
              className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-5 px-10 rounded-lg text-xl transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl"
            >
              Start Free Case Review
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>

          {/* Live Update */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 text-blue-200"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">
              <strong>437 people</strong> are viewing this page right now
            </span>
          </motion.div>

          {/* Recent Win Notification */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="fixed bottom-4 left-4 bg-white text-gray-900 rounded-lg shadow-2xl p-4 max-w-sm hidden lg:block"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Recent Settlement Win!</p>
                <p className="text-sm text-gray-600">
                  $125,000 settlement for car accident victim in Phoenix, AZ
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-12 border-t border-white/20"
          >
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">A+</div>
                <div className="text-sm text-blue-200">BBB Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">5.0</div>
                <div className="text-sm text-blue-200">Google Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">Top 1%</div>
                <div className="text-sm text-blue-200">Trial Lawyers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">30+</div>
                <div className="text-sm text-blue-200">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
