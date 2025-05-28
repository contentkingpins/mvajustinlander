/**
 * CTA Section Component
 * Final call-to-action section with urgency messaging
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFormModal } from '@/providers/FormProvider';

export const CTASection: React.FC = () => {
  const { openModal } = useFormModal();

  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-red-500 text-white rounded-full px-4 py-2 mb-6"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Time is Limited - Act Now!</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Don't Wait - Your Rights Have Deadlines
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-blue-100"
          >
            Every state has strict time limits for filing injury claims. 
            The sooner you act, the stronger your case will be.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-2">100%</div>
              <div className="text-sm">Free Consultation</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm">Available Support</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-2">No Win</div>
              <div className="text-sm">No Fee Guarantee</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              variant="primary"
              onClick={openModal}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-8 py-4"
            >
              Start Your Free Case Review
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
              className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-4"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
            </Button>
          </motion.div>

          {/* Availability Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-blue-100"
          >
            <Clock className="w-5 h-5" />
            <span>Representatives available 24/7 - Weekends & Holidays included</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
