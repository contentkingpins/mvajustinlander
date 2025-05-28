/**
 * FAQ Section
 * Frequently asked questions with expandable answers
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    question: "How much does it cost to hire an attorney?",
    answer: "Nothing upfront! Our partner attorneys work on a contingency fee basis, which means you pay nothing unless they win your case. Their fee is typically a percentage of your settlement or verdict.",
    popular: true,
  },
  {
    question: "How long will my case take?",
    answer: "Every case is different, but most personal injury cases settle within 6-12 months. Complex cases that go to trial may take longer. Your attorney will give you a realistic timeline based on your specific situation.",
  },
  {
    question: "What if I was partially at fault?",
    answer: "You may still have a case! Many states follow comparative negligence rules, which means you can recover damages even if you were partially at fault. Your attorney will explain how this applies to your case.",
  },
  {
    question: "How much is my case worth?",
    answer: "Case values depend on many factors including medical expenses, lost wages, pain and suffering, and the severity of your injuries. Our attorneys will evaluate all aspects to maximize your compensation.",
    popular: true,
  },
  {
    question: "Should I talk to the insurance company?",
    answer: "No! Insurance companies often try to minimize payouts. Let your attorney handle all communications to protect your rights and ensure you get fair compensation.",
  },
  {
    question: "What if the accident happened months ago?",
    answer: "You may still have a case, but time is critical. Every state has statutes of limitations for filing injury claims. Contact us immediately to ensure you don't miss important deadlines.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50" id="faq">
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
          <p className="text-xl text-slate-900 max-w-3xl mx-auto">
            Get answers to common questions about personal injury claims and working with our attorneys.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-start gap-4 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <HelpCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 pr-8">
                    {faq.question}
                  </h3>
                  {faq.popular && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-600" />
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
                    <div className="px-6 pb-5 pl-16 text-slate-900">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-slate-900 mb-6">
            Have more questions? We're here to help 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              Call: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
            </button>
            <button className="bg-white hover:bg-slate-50 text-blue-600 font-bold py-3 px-6 rounded-lg border-2 border-blue-600 transition-all">
              Start Live Chat
            </button>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-sm text-slate-900">
            <strong>100% Confidential</strong> • No obligation to hire • Free case evaluation
          </p>
        </motion.div>
      </div>
    </section>
  );
};
