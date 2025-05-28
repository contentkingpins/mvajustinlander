/**
 * CTA Section
 * Final call-to-action with emotional connection and genuine urgency
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Shield, AlertTriangle, Heart, ArrowRight } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { ConversionType } from '@/types';
import { AccidentForm } from '@/components/forms/AccidentForm';

export const CTASection = () => {
  const { trackConversion } = useTracking();
  const [showAccidentForm, setShowAccidentForm] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    setShowAccidentForm(true);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
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
            {/* Emotional Hook */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Heart className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                You're in Pain. Bills Are Piling Up.
                <span className="block text-blue-400 mt-2">You Deserve Justice.</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed"
            >
              Right now, you're dealing with physical pain, emotional stress, and financial pressure. 
              <span className="block mt-3 font-semibold text-white">
                While you're suffering, insurance companies are working to pay you as little as possible.
              </span>
            </motion.p>

            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-10 max-w-3xl mx-auto"
            >
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-lg text-gray-100">
                    <strong className="text-white">Every day matters.</strong> Evidence disappears. 
                    Witnesses forget. Insurance companies count on you waiting too long to file a claim.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Emotional Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-3 gap-6 mb-10 text-left max-w-3xl mx-auto"
            >
              <div className="bg-white/5 rounded-lg p-4">
                <Shield className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="font-semibold mb-1">Stop Fighting Alone</h3>
                <p className="text-sm text-white">
                  Insurance companies have teams of lawyers. Shouldn't you?
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <Heart className="w-8 h-8 text-red-400 mb-2" />
                <h3 className="font-semibold mb-1">Focus on Healing</h3>
                <p className="text-sm text-white">
                  Let us handle the legal battle while you recover.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400 mb-2" />
                <h3 className="font-semibold mb-1">Get What You Deserve</h3>
                <p className="text-sm text-white">
                  Don't settle for less because you don't know your rights.
                </p>
              </div>
            </motion.div>

            {/* The Promise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mb-10"
            >
              <p className="text-2xl font-semibold text-blue-300 mb-4">
                One call can change everything.
              </p>
              <p className="text-lg text-gray-100">
                No fees unless we win. We only get paid when you do.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8"
            >
              <button
                onClick={handlePhoneClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded-lg text-xl transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl"
              >
                <Phone className="w-6 h-6" />
                Talk to Someone Who Cares: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
              </button>

              <button
                onClick={handleFormClick}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-5 px-10 rounded-lg text-xl transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl"
              >
                Tell Us What Happened
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Trust Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="text-gray-100 text-sm"
            >
              <p>
                You've been through enough. Let us fight for you.
              </p>
            </motion.div>

            {/* Social Proof - More Subtle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="mt-16 pt-16 border-t border-white/10"
            >
              <p className="text-gray-100 mb-6">
                Join thousands who got the compensation they deserved
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-100">
                <div>
                  <div className="text-3xl font-bold text-white">$500M+</div>
                  <div className="text-sm text-gray-100">Recovered for Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">2,500+</div>
                  <div className="text-sm text-gray-100">Families Helped</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">30+</div>
                  <div className="text-sm text-gray-100">Years Fighting for Justice</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-100">We're Here When You Need Us</div>
                </div>
              </div>
            </motion.div>
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
