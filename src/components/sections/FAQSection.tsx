/**
 * FAQ Section
 * Frequently asked questions with expandable answers
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus, HelpCircle, Phone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Get answers to common questions about personal injury claims and our services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <h3 className="text-lg font-semibold text-blue-900 pr-8">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-5 pl-16 text-blue-700">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-blue-100 mb-6">
              Our team is available 24/7 to answer any questions about your case.
              Get a free consultation with no obligation.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Now: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
              </button>
              <p className="text-blue-100">
                Free Consultation • No Obligation • Available 24/7
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
