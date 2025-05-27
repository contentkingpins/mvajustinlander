/**
 * Benefits Section
 * Showcases key benefits with stagger animations
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Clock, DollarSign, Users, Award, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const benefits = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'No Fee Unless We Win',
    description: 'You pay nothing upfront. We only get paid when we win your case.',
    highlight: true,
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '24/7 Availability',
    description: 'We\'re here when you need us most. Call anytime, day or night.',
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Maximum Compensation',
    description: 'Our aggressive approach ensures you get every dollar you deserve.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Expert Legal Team',
    description: '30+ years of combined experience fighting for injury victims.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: '$500M+ Recovered',
    description: 'Proven track record of winning substantial settlements.',
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: 'Compassionate Care',
    description: 'We treat you like family and guide you through every step.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const BenefitsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gray-50" id="benefits">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-blue-600">Our Firm?</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We combine aggressive representation with compassionate care to ensure 
            you get the justice and compensation you deserve.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`h-full p-8 transition-all duration-300 cursor-pointer group ${
                  benefit.highlight 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 border-gray-200 hover:shadow-2xl'
                }`}
              >
                <div className={`mb-4 transition-colors duration-300 ${
                  benefit.highlight 
                    ? 'text-white' 
                    : 'text-blue-600 group-hover:text-white'
                }`}>
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className={`transition-colors duration-300 ${
                  benefit.highlight 
                    ? 'text-blue-100' 
                    : 'text-gray-700 group-hover:text-blue-100'
                }`}>
                  {benefit.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-6 bg-white rounded-full px-8 py-6 shadow-lg hover:shadow-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
            <div className="text-left">
              <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-lg">Trusted by 2,500+ Clients</div>
              <div className="text-sm text-gray-700 group-hover:text-blue-500 transition-colors duration-300">Average rating of 4.9/5 stars</div>
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