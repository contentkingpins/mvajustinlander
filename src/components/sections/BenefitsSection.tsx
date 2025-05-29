/**
 * Benefits Section
 * Showcases key benefits with optimized animations
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, DollarSign, Users, Award, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const benefits = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'No Fee Unless They Win',
    description: 'Our partner attorneys work on contingency. You pay nothing unless they win your case.',
    highlight: true,
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '24/7 Attorney Matching',
    description: 'We\'re here when you need us most. Get matched with an attorney anytime, day or night.',
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Maximum Compensation',
    description: 'We connect you to attorneys who fight aggressively for every dollar you deserve.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Pre-Screened Network',
    description: '500+ vetted injury attorneys with proven track records of success.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: '$500M+ Recovered',
    description: 'Our network attorneys have won substantial settlements for thousands of clients.',
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: 'Personal Matching',
    description: 'We personally match you with the right attorney for your specific case type.',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-blue-50" id="benefits">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Why Choose <span className="text-blue-600">Claim Connectors?</span>
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            We connect you to the best injury attorneys in your area and ensure 
            you get the expert legal representation you deserve.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-white border-blue-200"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <div className="text-blue-600 group-hover:text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-900 group-hover:text-blue-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className={
                  'transition-colors duration-300 ' +
                  (benefit.highlight
                    ? 'text-blue-800 font-medium'
                    : 'text-blue-700')
                }>
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <div className="inline-flex items-center gap-6 bg-white rounded-full px-8 py-6 shadow-lg hover:shadow-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer group border-2 border-blue-200">
            <div className="text-left">
              <div className="font-bold text-blue-900 group-hover:text-blue-600 transition-colors duration-300 text-lg">Trusted by 2,500+ Clients</div>
              <div className="text-sm text-blue-700 group-hover:text-blue-600 transition-colors duration-300">Average rating of 4.9/5 stars</div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl group-hover:scale-110 transition-transform duration-300">★</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 