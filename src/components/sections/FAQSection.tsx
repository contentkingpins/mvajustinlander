/**
 * FAQ Section
 * Frequently asked questions with accordion
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    question: 'How much does it cost to hire your law firm?',
    answer: 'Nothing upfront! We work on a contingency fee basis, which means you pay absolutely nothing unless we win your case. Our fee is a percentage of the settlement or verdict we secure for you. If we don\'t win, you don\'t pay.',
    category: 'Fees',
  },
  {
    question: 'How long do I have to file a personal injury claim?',
    answer: 'The statute of limitations varies by state, but it\'s typically 2-3 years from the date of the accident. However, it\'s crucial to contact us as soon as possible. Evidence can disappear, witnesses\' memories fade, and some claims have shorter deadlines.',
    category: 'Timeline',
  },
  {
    question: 'What\'s my case worth?',
    answer: 'Every case is unique, but compensation typically includes medical expenses (past and future), lost wages, pain and suffering, property damage, and loss of quality of life. We\'ll evaluate your specific situation during your free consultation and fight for maximum compensation.',
    category: 'Compensation',
  },
  {
    question: 'Should I talk to the insurance company?',
    answer: 'No! Insurance companies are not on your side. They often try to get you to say something that hurts your case or accept a lowball offer. Let us handle all communication with insurance companies to protect your rights.',
    category: 'Insurance',
  },
  {
    question: 'What if I was partially at fault for the accident?',
    answer: 'You may still be entitled to compensation. Most states follow comparative negligence rules, meaning you can recover damages even if you were partially at fault. We\'ll investigate thoroughly to minimize any fault assigned to you.',
    category: 'Fault',
  },
  {
    question: 'How long will my case take?',
    answer: 'Most cases settle within 3-6 months, but complex cases involving severe injuries or disputed liability can take 1-2 years. We work efficiently to resolve your case quickly while ensuring you get the maximum compensation you deserve.',
    category: 'Timeline',
  },
  {
    question: 'Do I have to go to court?',
    answer: 'Most personal injury cases (about 95%) settle out of court. However, we prepare every case as if it\'s going to trial to show insurance companies we mean business. If trial is necessary, we\'ll be with you every step of the way.',
    category: 'Process',
  },
  {
    question: 'What should I do immediately after an accident?',
    answer: 'First, seek medical attention even if you feel fine - some injuries aren\'t immediately apparent. Then: 1) Document everything (photos, witness info), 2) Don\'t admit fault, 3) Don\'t sign anything from insurance companies, 4) Keep all medical records, 5) Call us for a free consultation.',
    category: 'Process',
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about personal injury claims and our legal services.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <HelpCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-5 pl-16 text-gray-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-700 mb-6">
                Our experienced attorneys are available 24/7 to answer your questions and evaluate your case for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
                  Get Free Consultation
                </button>
                <button className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-6 rounded-lg border-2 border-blue-600 transition-all">
                  Call: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-500">
              Trusted by over 2,500 clients • 98% success rate • $500M+ recovered
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
