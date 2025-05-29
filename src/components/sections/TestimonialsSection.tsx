/**
 * Testimonials Section
 * Client testimonials with ratings and carousel
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star, Quote, User, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFormModal } from '@/providers/FormProvider';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'Phoenix, AZ',
    rating: 5,
    date: '2 months ago',
    text: 'After my car accident, I was overwhelmed and didn\'t know where to turn. This team not only got me a settlement that covered all my medical bills but also compensation for my pain and suffering. They handled everything while I focused on recovery.',
    settlement: '$125,000',
    caseType: 'Car Accident',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Los Angeles, CA',
    rating: 5,
    date: '3 weeks ago',
    text: 'I was hit by a commercial truck and the insurance company tried to lowball me. These attorneys fought hard and got me 10x what the insurance initially offered. They truly care about their clients.',
    settlement: '$450,000',
    caseType: 'Truck Accident',
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    location: 'Houston, TX',
    rating: 5,
    date: '1 month ago',
    text: 'The insurance company denied my claim after a motorcycle accident. These lawyers took my case on contingency and won! I received enough to cover my surgeries and lost wages. Forever grateful!',
    settlement: '$275,000',
    caseType: 'Motorcycle Accident',
  },
  {
    id: 4,
    name: 'James Williams',
    location: 'Chicago, IL',
    rating: 5,
    date: '5 weeks ago',
    text: 'Slipped and fell at a major retail store. They tried to blame me, but my attorney proved negligence and secured a great settlement. The whole process was smooth and stress-free.',
    settlement: '$85,000',
    caseType: 'Slip & Fall',
  },
  {
    id: 5,
    name: 'Emily Davis',
    location: 'Dallas, TX',
    rating: 5,
    date: '2 weeks ago',
    text: 'After being rear-ended, I had severe whiplash and couldn\'t work. My attorney got me compensated for medical bills, lost wages, and future treatment. They exceeded all expectations!',
    settlement: '$95,000',
    caseType: 'Rear-End Collision',
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { openModal } = useFormModal();

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-blue-50" id="testimonials">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Real Clients, <span className="text-blue-600">Real Results</span>
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Don't just take our word for it. See what our clients say about their experience.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="text-center p-6 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group hover:shadow-xl bg-white border-blue-200">
            <div className="text-3xl font-bold text-blue-600 group-hover:text-white transition-colors duration-300">4.9/5</div>
            <div className="text-blue-700 group-hover:text-blue-100 transition-colors duration-300">Average Rating</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              ))}
            </div>
          </Card>
          <Card className="text-center p-6 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group hover:shadow-xl bg-white border-blue-200">
            <div className="text-3xl font-bold text-blue-600 group-hover:text-white transition-colors duration-300">2,500+</div>
            <div className="text-blue-700 group-hover:text-blue-100 transition-colors duration-300">Happy Clients</div>
          </Card>
          <Card className="text-center p-6 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group hover:shadow-xl bg-white border-blue-200">
            <div className="text-3xl font-bold text-blue-600 group-hover:text-white transition-colors duration-300">98%</div>
            <div className="text-blue-700 group-hover:text-blue-100 transition-colors duration-300">Success Rate</div>
          </Card>
          <Card className="text-center p-6 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group hover:shadow-xl bg-white border-blue-200">
            <div className="text-3xl font-bold text-blue-600 group-hover:text-white transition-colors duration-300">$500M+</div>
            <div className="text-blue-700 group-hover:text-blue-100 transition-colors duration-300">Total Recovered</div>
          </Card>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900">{currentTestimonial.name}</h3>
                <span className="text-blue-600 text-sm">{currentTestimonial.date}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg md:text-xl text-blue-800 mb-6 italic">
                "{currentTestimonial.text}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-blue-600">Case Type</p>
                <p className="font-semibold text-blue-900">{currentTestimonial.caseType}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Settlement</p>
                <p className="font-semibold text-blue-600 text-xl">{currentTestimonial.settlement}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <p className="text-blue-700">{currentTestimonial.location}</p>
              </div>
            </div>
          </Card>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-110'
                    : 'bg-blue-300 hover:bg-blue-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-blue-700 mb-6">
            Ready to get the compensation you deserve?
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={openModal}
            className="text-xl"
          >
            Get Your Free Case Review
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
