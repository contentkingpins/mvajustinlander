/**
 * Process Section
 * Shows the simple steps to get legal help
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, FileText, Scale, DollarSign } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Free Consultation',
    description: 'Call us 24/7 for a free case review. We\'ll listen to your story and explain your rights.',
    icon: <Phone className="w-6 h-6" />,
    duration: 'Same Day',
  },
  {
    number: '02',
    title: 'Case Investigation',
    description: 'We gather evidence, interview witnesses, and build a strong case for maximum compensation.',
    icon: <FileText className="w-6 h-6" />,
    duration: '1-2 Weeks',
  },
  {
    number: '03',
    title: 'Fight for You',
    description: 'Our experienced attorneys negotiate aggressively with insurance companies and in court.',
    icon: <Scale className="w-6 h-6" />,
    duration: '2-6 Months',
  },
  {
    number: '04',
    title: 'Get Your Money',
    description: 'We secure your settlement or verdict. You pay nothing unless we win your case.',
    icon: <DollarSign className="w-6 h-6" />,
    duration: 'No Fee Unless We Win',
  },
];

export const ProcessSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" id="process">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Getting Help is <span className="text-blue-600">Simple</span>
          </h2>
          <p className="text-xl text-slate-900 max-w-3xl mx-auto">
            We handle everything so you can focus on healing. Here's how we'll fight for your rights.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-blue-400" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="flex-1 md:px-12">
                  <div
                    className={`bg-white rounded-lg shadow-lg p-8 ${
                      index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      <div className="bg-blue-600 text-white rounded-full p-3">
                        {step.icon}
                      </div>
                      <div className="text-5xl font-bold text-gray-300">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-900 mb-3">{step.description}</p>
                    <div className="inline-flex items-center text-sm font-semibold text-blue-600">
                      <span className="bg-blue-100 px-3 py-1 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-slate-900 mb-6">
            Ready to get started? Contact us today for your free consultation.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105">
            Start Your Free Case Review
          </button>
        </motion.div>
      </div>
    </section>
  );
};
