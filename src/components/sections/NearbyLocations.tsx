/**
 * Nationwide Attorney Network Section
 * Shows referral network coverage and attorney partnerships
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Shield, Award, Phone, CheckCircle, Network } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const networkCities = [
  {
    city: 'Los Angeles',
    state: 'CA',
    attorneys: 25,
    featured: true,
  },
  {
    city: 'Phoenix',
    state: 'AZ',
    attorneys: 18,
    featured: true,
  },
  {
    city: 'Houston',
    state: 'TX',
    attorneys: 22,
    featured: true,
  },
  {
    city: 'Chicago',
    state: 'IL',
    attorneys: 20,
    featured: true,
  },
  {
    city: 'Dallas',
    state: 'TX',
    attorneys: 15,
  },
  {
    city: 'San Diego',
    state: 'CA',
    attorneys: 12,
  },
  {
    city: 'Las Vegas',
    state: 'NV',
    attorneys: 10,
  },
  {
    city: 'Miami',
    state: 'FL',
    attorneys: 14,
  },
];

const practiceAreas = [
  'Car Accidents',
  'Truck Accidents',
  'Motorcycle Accidents',
  'Pedestrian Accidents',
  'Rideshare Accidents',
  'Slip & Fall',
  'Workplace Injuries',
  'Wrongful Death',
];

const networkStats = [
  {
    icon: <Users className="w-8 h-8" />,
    number: '500+',
    label: 'Vetted Attorneys',
    description: 'Pre-screened injury lawyers nationwide'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    number: '15+',
    label: 'States Covered',
    description: 'Licensed attorneys in major markets'
  },
  {
    icon: <Award className="w-8 h-8" />,
    number: '98%',
    label: 'Success Rate',
    description: 'Successful attorney matches'
  },
];

export const NearbyLocations = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" id="network">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nationwide Attorney <span className="text-blue-600">Network</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We connect you to top-rated injury attorneys in your area. Our pre-screened network ensures you get the best legal representation.
          </p>
        </motion.div>

        {/* Network Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {networkStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            >
              <Card className="text-center p-8 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 group-hover:bg-white rounded-full mb-4 transition-colors duration-300">
                  <div className="text-blue-600 group-hover:text-blue-600 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-600 group-hover:text-white mb-2 transition-colors duration-300">
                  {stat.number}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-700 group-hover:text-blue-100 transition-colors duration-300">
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Coverage Map Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center mb-8">
              <Network className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Connected Coast to Coast
              </h3>
              <p className="text-gray-700">
                Our attorney network spans major metropolitan areas nationwide
              </p>
            </div>
            
            {/* Featured Cities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {networkCities.filter(city => city.featured).map((city, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {city.attorneys}+
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {city.city}, {city.state}
                  </div>
                  <div className="text-xs text-gray-600">
                    Attorneys Available
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Network Details Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="p-8 h-full">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Network Coverage
              </h3>
              <div className="space-y-3">
                {networkCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">
                        {city.city}, {city.state}
                      </span>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">
                      {city.attorneys}+ attorneys
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="p-8 h-full">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Specialization Areas
              </h3>
              <div className="space-y-3">
                {practiceAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Connection CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Get Connected to the Right Attorney Today
            </h3>
            <p className="text-xl mb-6 text-blue-100">
              We'll match you with a top-rated injury attorney in your area within 24 hours.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Get Attorney Match
              </button>
              <p className="text-blue-100">
                Free Service • No Obligation • Pre-Screened Attorneys Only
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
