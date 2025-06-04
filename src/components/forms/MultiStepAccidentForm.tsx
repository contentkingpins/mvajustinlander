/**
 * Multi-Step Accident Form Component
 * Captures accident information in stages for better user experience
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, MapPin, Phone, Mail, Calendar, Car, AlertCircle, FileText, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { trackFormStep, trackFormSubmission } from '@/lib/tracking';

interface FormData {
  // Step 1
  zipCode: string;
  email: string;
  phoneNumber: string;
  
  // Step 2
  accidentType: string;
  role: string;
  atFault: string;
  incidentDate: string;
  medicalAttention: string;
  
  // Step 3
  description: string;
}

interface MultiStepAccidentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCIDENT_TYPES = [
  { value: 'car', label: 'Car Accident' },
  { value: 'truck', label: 'Truck Accident' },
  { value: 'uber', label: 'Uber Accident' },
  { value: 'lyft', label: 'Lyft Accident' },
];

const ROLE_OPTIONS = [
  { value: 'driver', label: 'Driver' },
  { value: 'passenger', label: 'Passenger' },
  { value: 'rideshare_customer', label: 'Rideshare Customer' },
];

export const MultiStepAccidentForm: React.FC<MultiStepAccidentFormProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const { formData, updateFormData, clearFormData, isLoaded } = useFormPersistence<FormData>('accident-form', {
    zipCode: '',
    email: '',
    phoneNumber: '',
    accidentType: '',
    role: '',
    atFault: '',
    incidentDate: '',
    medicalAttention: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen && currentStep === 1) {
      trackFormStep('accident_form', 1);
    }
  }, [isOpen, currentStep]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.zipCode.match(/^\d{5}$/)) {
          newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phoneNumber.match(/^\d{10}$/)) {
          newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }
        break;
      
      case 2:
        if (!formData.accidentType) {
          newErrors.accidentType = 'Please select an accident type';
        }
        if (!formData.role) {
          newErrors.role = 'Please select your role in the accident';
        }
        if (!formData.atFault) {
          newErrors.atFault = 'Please indicate fault status';
        }
        if (!formData.incidentDate) {
          newErrors.incidentDate = 'Please enter the date of the incident';
        }
        if (!formData.medicalAttention) {
          newErrors.medicalAttention = 'Please indicate if you sought medical attention';
        }
        break;
      
      case 3:
        if (!formData.description.trim() || formData.description.length < 20) {
          newErrors.description = 'Please provide more details about your accident (at least 20 characters)';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      trackFormStep('accident_form', nextStep);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-accident-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        trackFormSubmission('accident_form', formData);
        setShowSuccess(true);
        clearFormData();
        
        // Show success message for 5 seconds then close
        setTimeout(() => {
          resetForm();
        }, 5000);
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      handleInputChange('phoneNumber', numbers);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setShowSuccess(false);
    setErrors({});
    onClose();
  };

  // Don't render form until data is loaded to prevent controlled/uncontrolled issues
  if (!isOpen || !isLoaded) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl my-8"
      >
        <Card className="p-4 sm:p-6 md:p-8 relative">
          {/* Close Button - Increased touch target */}
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>

          {!showSuccess ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-600">Step {currentStep} of 3</span>
                  <span className="text-sm text-blue-600">{Math.round((currentStep / 3) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" custom={currentStep}>
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                          Let&apos;s Get Started
                        </h2>
                        <p className="text-blue-700">
                          Enter your contact information to begin your free case evaluation
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            ZIP Code Where Accident Occurred *
                          </label>
                          <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px] ${
                              errors.zipCode ? 'border-red-500' : 'border-blue-300'
                            }`}
                            placeholder="12345"
                            maxLength={5}
                            inputMode="numeric"
                            autoComplete="postal-code"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          />
                          {errors.zipCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px] ${
                              errors.email ? 'border-red-500' : 'border-blue-300'
                            }`}
                            placeholder="your@email.com"
                            autoComplete="email"
                            inputMode="email"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={formatPhoneNumber(formData.phoneNumber)}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px] ${
                              errors.phoneNumber ? 'border-red-500' : 'border-blue-300'
                            }`}
                            placeholder="(555) 123-4567"
                            autoComplete="tel"
                            inputMode="tel"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Accident Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                          Accident Details
                        </h2>
                        <p className="text-blue-700">
                          Help us understand your accident better
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            <Car className="w-4 h-4 inline mr-2" />
                            What type of accident? *
                          </label>
                          <select
                            value={formData.accidentType}
                            onChange={(e) => handleInputChange('accidentType', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px] ${
                              errors.accidentType ? 'border-red-500' : 'border-blue-300'
                            }`}
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          >
                            <option value="">Select accident type</option>
                            {ACCIDENT_TYPES.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          {errors.accidentType && (
                            <p className="text-red-500 text-sm mt-1">{errors.accidentType}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            Were you the driver, passenger, or rideshare customer? *
                          </label>
                          <select
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px] ${
                              errors.role ? 'border-red-500' : 'border-blue-300'
                            }`}
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          >
                            <option value="">Select your role</option>
                            {ROLE_OPTIONS.map(role => (
                              <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                          </select>
                          {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            <AlertCircle className="w-4 h-4 inline mr-2" />
                            Were you at fault in this accident? *
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: 'no', label: 'No, I was not at fault' },
                              { value: 'yes', label: 'Yes, I was at fault' },
                              { value: 'partial', label: 'Partially at fault' },
                              { value: 'unknown', label: 'Not sure / To be determined' }
                            ].map((option) => (
                              <label key={option.value} className="flex items-center min-h-[44px] cursor-pointer">
                                <input
                                  type="radio"
                                  value={option.value}
                                  checked={formData.atFault === option.value}
                                  onChange={(e) => handleInputChange('atFault', e.target.value)}
                                  className="mr-3 text-blue-600 w-4 h-4"
                                />
                                <span className="text-base">{option.label}</span>
                              </label>
                            ))}
                          </div>
                          {errors.atFault && (
                            <p className="text-red-500 text-sm mt-1">{errors.atFault}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Date of incident *
                          </label>
                          <input
                            type="date"
                            value={formData.incidentDate}
                            onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px] ${
                              errors.incidentDate ? 'border-red-500' : 'border-blue-300'
                            }`}
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                          />
                          {errors.incidentDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.incidentDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-2">
                            Have you sought medical attention? *
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' }
                            ].map((option) => (
                              <label key={option.value} className="flex items-center min-h-[44px] cursor-pointer">
                                <input
                                  type="radio"
                                  value={option.value}
                                  checked={formData.medicalAttention === option.value}
                                  onChange={(e) => handleInputChange('medicalAttention', e.target.value)}
                                  className="mr-3 text-blue-600 w-4 h-4"
                                />
                                <span className="text-base">{option.label}</span>
                              </label>
                            ))}
                          </div>
                          {errors.medicalAttention && (
                            <p className="text-red-500 text-sm mt-1">{errors.medicalAttention}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Description */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                          Tell Us More
                        </h2>
                        <p className="text-blue-700">
                          Please provide a brief description of what happened
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-2">
                          <FileText className="w-4 h-4 inline mr-2" />
                          Brief Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={6}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-base min-h-[120px] ${
                            errors.description ? 'border-red-500' : 'border-blue-300'
                          }`}
                          placeholder="Please describe what happened, including any injuries sustained, damage to vehicles, and any other important details..."
                          style={{ fontSize: '16px' }} // Prevent zoom on iOS
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                        <p className="text-sm text-blue-600 mt-2">
                          {formData.description.length} characters
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons - Increased touch targets */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors min-h-[44px]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
                
                <div className={currentStep === 1 ? 'ml-auto' : ''}>
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 min-h-[44px]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Case'}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
                Thank You!
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="text-lg text-blue-800 font-medium mb-2">
                  Based on your information, we are elevating your incident to a case manager to assist you.
                </p>
                <p className="text-blue-700">
                  A specialist will contact you within 24 hours to discuss your case and next steps.
                </p>
              </div>
              <p className="text-sm text-blue-600">
                This window will close automatically...
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}; 