/**
 * Nationwide Attorney Network Section
 * Shows referral network coverage and attorney partnerships
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Shield, Award, Phone, CheckCircle, Network, MapPin, Trophy, Mail, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFormModal } from '@/providers/FormProvider';

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
  const { openModal } = useFormModal();

  const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    // Simulate getting user location (in production, use real geolocation)
    const getUserLocation = async () => {
      try {
        // This would be replaced with actual geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation(`${data.city}, ${data.region}`);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getUserLocation();
  }, []);

  return (
    <section className="py-20 bg-blue-50" id="locations">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            We Serve <span className="text-blue-600">Your Area</span>
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Our network of attorneys covers all major cities and surrounding areas. 
            Get connected with a local expert who knows your jurisdiction.
          </p>
        </motion.div>

        {/* User Location Banner */}
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-blue-100 px-6 py-3 rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" />
              <p className="text-lg font-medium text-blue-900">
                Attorneys available near <span className="font-bold">{userLocation}</span>
              </p>
            </div>
          </motion.div>
        )}

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
              <Card className="text-center p-8 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group hover:shadow-xl bg-white border-blue-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 group-hover:bg-white rounded-full mb-4 transition-colors duration-300">
                  <div className="text-blue-600 group-hover:text-blue-600 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-600 group-hover:text-white mb-2 transition-colors duration-300">
                  {stat.number}
                </div>
                <h3 className="font-bold text-lg mb-2 text-blue-900 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </h3>
                <p className="text-sm text-blue-700 group-hover:text-blue-100 transition-colors duration-300">
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
          <Card className="p-8 bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">
                Nationwide Coverage
              </h3>
              <p className="text-blue-700 mb-6">
                500+ vetted attorneys across all 50 states
              </p>
              
              {/* State List */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
                {practiceAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-blue-800">{area}</span>
                  </div>
                ))}
              </div>
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
            <Card className="p-8 h-full bg-white border-blue-200">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900">
                <Users className="w-8 h-8 text-blue-600" />
                Network Coverage
              </h3>
              <div className="space-y-3">
                {networkCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-blue-900 font-medium">
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
            <Card className="p-8 h-full bg-white border-blue-200">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-900">
                <Shield className="w-8 h-8 text-blue-600" />
                Specialization Areas
              </h3>
              <div className="space-y-3">
                {practiceAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-blue-900 font-medium">{area}</span>
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
              <Button
                size="lg"
                variant="primary"
                onClick={openModal}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Get Attorney Match
              </Button>
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

