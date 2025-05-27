/**
 * Nearby Locations Section
 * Shows service areas and locations
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Phone, Car, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const majorCities = [
  {
    city: 'Los Angeles',
    state: 'CA',
    population: '3.9M',
    offices: 3,
    featured: true,
  },
  {
    city: 'Phoenix',
    state: 'AZ',
    population: '1.6M',
    offices: 2,
    featured: true,
  },
  {
    city: 'Houston',
    state: 'TX',
    population: '2.3M',
    offices: 2,
    featured: true,
  },
  {
    city: 'Chicago',
    state: 'IL',
    population: '2.7M',
    offices: 2,
    featured: true,
  },
  {
    city: 'Dallas',
    state: 'TX',
    population: '1.3M',
    offices: 1,
  },
  {
    city: 'San Diego',
    state: 'CA',
    population: '1.4M',
    offices: 1,
  },
  {
    city: 'Las Vegas',
    state: 'NV',
    population: '641K',
    offices: 1,
  },
  {
    city: 'Miami',
    state: 'FL',
    population: '467K',
    offices: 1,
  },
];

const serviceAreas = [
  'Car Accidents',
  'Truck Accidents',
  'Motorcycle Accidents',
  'Pedestrian Accidents',
  'Rideshare Accidents',
  'Slip & Fall',
  'Workplace Injuries',
  'Wrongful Death',
];

export const NearbyLocations = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white" id="locations">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Serving Victims <span className="text-blue-600">Nationwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With offices across the country, we're always nearby when you need us most.
          </p>
        </motion.div>

        {/* Map Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 1000 600" className="w-full h-full">
                {/* Simple US map outline */}
                <path
                  d="M 100 300 Q 200 200 400 250 T 600 200 Q 800 250 900 300 L 900 500 Q 700 450 500 480 Q 300 450 100 500 Z"
                  fill="currentColor"
                  className="text-blue-600"
                />
              </svg>
            </div>
            
            {/* Location pins */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {majorCities.filter(city => city.featured).map((city, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-3 shadow-lg">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg">{city.city}, {city.state}</h3>
                  <p className="text-sm text-gray-600">{city.offices} Office{city.offices > 1 ? 's' : ''}</p>
                  <p className="text-xs text-gray-500">Pop: {city.population}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Service Areas Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              All Locations
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {majorCities.map((city, index) => (
                <div key={index} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    {city.city}, {city.state}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-600" />
              Practice Areas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Distance Shouldn't Stop You From Getting Justice
            </h3>
            <p className="text-xl mb-6 text-blue-100">
              We have offices nationwide and can handle your case no matter where you are.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call for Free Consultation
              </button>
              <p className="text-blue-100">
                Available 24/7 • Free Case Review • No Fees Unless We Win
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
