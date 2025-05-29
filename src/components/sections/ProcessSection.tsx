/**
 * Process Section
 * Shows the simple steps to get legal help
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, FileText, Scale, DollarSign, Check } from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  details?: string[];
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Free Consultation",
    description: "Tell us about your case in a free, confidential consultation with our team.",
    icon: <Phone className="w-6 h-6 text-blue-600" />,
    duration: "Same Day",
    details: [
      "Available 24/7 by phone or online",
      "No obligation to proceed",
      "100% confidential discussion"
    ]
  },
  {
    number: "02",
    title: "Case Evaluation",
    description: "Our team reviews your case details and matches you with the best attorney for your situation.",
    icon: <FileText className="w-6 h-6 text-blue-600" />,
    duration: "24-48 Hours",
    details: [
      "Thorough case analysis",
      "Expert attorney matching",
      "Clear next steps provided"
    ]
  },
  {
    number: "03",
    title: "Legal Representation",
    description: "Your attorney builds your case and fights for maximum compensation while you focus on recovery.",
    icon: <Scale className="w-6 h-6 text-blue-600" />,
    duration: "Ongoing",
    details: [
      "Regular case updates",
      "Experienced negotiation",
      "Court representation if needed"
    ]
  },
  {
    number: "04",
    title: "Maximum Compensation",
    description: "We don't stop until you get the compensation you deserve for your injuries and damages.",
    icon: <DollarSign className="w-6 h-6 text-blue-600" />,
    duration: "Results-Based",
    details: [
      "No fees unless we win",
      "Maximum settlement pursuit",
      "Full compensation for damages"
    ]
  }
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Getting Help is <span className="text-blue-600">Simple</span>
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            We handle everything so you can focus on healing. Here's how we'll fight for your rights.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-200" />

          {/* Steps */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Step Number */}
              <div className="absolute left-2.5 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/3 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-100" />

              {/* Content */}
              <div className="flex-1 pl-12 md:pl-0">
                <div className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-900">{step.title}</h3>
                      <p className="text-blue-700 mb-3">{step.description}</p>
                      {step.details && (
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-blue-600">
                              <Check className="w-5 h-5 text-green-500" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-blue-700 mb-6">
            Ready to get started? We're here to help 24/7.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105">
            Get Your Free Case Review
          </button>
        </motion.div>
      </div>
    </section>
  );
};
