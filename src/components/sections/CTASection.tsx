/**
 * Call-to-Action Section Component
 * Final conversion section with strong CTA and contact options
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useFormModal } from '@/providers/FormProvider';
import { deviceUtils, formatPhoneNumber } from '@/lib/utils';

export const CTASection: React.FC = () => {
  const { openModal } = useFormModal();

  const handlePhoneClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567';
    deviceUtils.handlePhoneClick(phoneNumber);
  };

  const displayPhone = formatPhoneNumber(process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567');

  const urgencyPoints = [
    { icon: Clock, text: 'Time limits apply to your case' },
    { icon: Shield, text: 'Evidence disappears quickly' },
    { icon: MessageSquare, text: 'Insurance companies act fast' },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Don't Wait - Your Case Won't Wait Either
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Every day you wait is a day the insurance companies use against you. 
            Get your free case evaluation now.
          </motion.p>

          {/* Urgency Points */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {urgencyPoints.map((point, index) => (
              <Card key={index} className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-3 text-yellow-400 mb-3">
                  <point.icon className="w-6 h-6" />
                  <span className="font-semibold">Important</span>
                </div>
                <p className="text-blue-100">{point.text}</p>
              </Card>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              variant="primary"
              onClick={openModal}
              className="text-lg px-8 py-4 bg-yellow-500 text-blue-900 hover:bg-yellow-400 font-bold min-h-[44px]"
            >
              Get My Free Case Review Now
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={handlePhoneClick}
              className="text-lg px-8 py-4 bg-white text-blue-900 hover:bg-blue-50 min-h-[44px]"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: {displayPhone}
            </Button>
          </motion.div>

          {/* Guarantee */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-blue-100 mb-2">
              <strong className="text-yellow-400">100% Free Consultation</strong> - No Fees Unless We Win
            </p>
            <p className="text-sm text-blue-200">
              Available 24/7 • Confidential • No Obligation
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
