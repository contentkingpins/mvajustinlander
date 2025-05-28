/**
 * Accident Form Component
 * Captures initial accident information from users
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface AccidentFormData {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  comments: string;
}

interface AccidentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const AccidentForm: React.FC<AccidentFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<AccidentFormData>({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [errors, setErrors] = useState<Partial<AccidentFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AccidentFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.comments.trim()) {
      newErrors.comments = 'Please tell us what happened';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form data
      const response = await fetch('/api/submit-accident-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show recommendation popup
        setShowRecommendation(true);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your information. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AccidentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCallNow = () => {
    // Track the call action
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'phone_call', {
        event_category: 'engagement',
        event_label: 'accident_form_recommendation'
      });
    }
    
    // Initiate phone call
    window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`;
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      comments: ''
    });
    setErrors({});
    setShowRecommendation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl my-8"
      >
        <Card className="p-4 sm:p-6 md:p-8 relative">
          {/* Close Button */}
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition-colors p-2"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>

          {!showRecommendation ? (
            <>
              {/* Form Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                  Tell Us What Happened
                </h2>
                <p className="text-blue-700 text-sm sm:text-base px-2">
                  Share your accident details and we'll connect you with the right attorney
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${
                        errors.firstName ? 'border-red-500' : 'border-blue-300'
                      }`}
                      placeholder="Enter your first name"
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${
                        errors.lastName ? 'border-red-500' : 'border-blue-300'
                      }`}
                      placeholder="Enter your last name"
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      City Where Accident Occurred *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${
                        errors.city ? 'border-red-500' : 'border-blue-300'
                      }`}
                      placeholder="Enter city name"
                      autoComplete="address-level2"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${
                        errors.state ? 'border-red-500' : 'border-blue-300'
                      }`}
                      autoComplete="address-level1"
                    >
                      <option value="">Select a state</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Tell Us What Happened *
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-base ${
                      errors.comments ? 'border-red-500' : 'border-blue-300'
                    }`}
                    placeholder="Please describe your accident in detail. Include when it happened, what type of accident, any injuries, and any other relevant information..."
                  />
                  {errors.comments && (
                    <p className="text-red-500 text-sm mt-1">{errors.comments}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Attorney Recommendation'}
                </button>

                {/* Privacy Notice */}
                <p className="text-xs text-blue-600 text-center px-4">
                  Your information is secure and will only be shared with qualified attorneys in your area.
                </p>
              </form>
            </>
          ) : (
            /* Recommendation Popup */
            <div className="text-center px-2">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                  We Can Help You!
                </h2>
                <p className="text-base sm:text-lg text-blue-700 mb-4">
                  Based on your information, we recommend speaking to a specialist immediately.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 font-medium text-sm sm:text-base">
                    Hello {formData.firstName}, we've reviewed your {formData.city}, {formData.state} accident case.
                    Our network attorneys have handled similar cases and recovered significant compensation for clients.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCallNow}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                >
                  <Phone className="w-5 h-5" />
                  Call Now: {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
                </button>
                
                <p className="text-sm text-blue-600">
                  Free consultation • Available 24/7 • No fees unless we win
                </p>
                
                <button
                  onClick={resetForm}
                  className="text-blue-600 hover:text-blue-800 underline text-sm p-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}; 