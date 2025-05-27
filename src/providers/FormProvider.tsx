/**
 * FormProvider component that manages form state persistence,
 * field tracking, smart defaults, and multi-step navigation
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useTracking } from '@/hooks/useTracking';
import { LeadFormData, FormState, FormStep, AccidentType, ConversionType } from '@/types';
import { setCookie, getCookie } from 'cookies-next';
import { z } from 'zod';

// Constants
const FORM_STORAGE_KEY = 'mvaj_form_progress';
const FORM_COOKIE_NAME = 'mvaj_form_state';
const FORM_EXPIRY_DAYS = 7;
const AUTOSAVE_DELAY_MS = 1000;
const ABANDONED_FORM_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

// Form validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{3}-?\d{3}-?\d{4}$/, 'Invalid phone number'),
});

const accidentInfoSchema = z.object({
  accidentType: z.nativeEnum(AccidentType),
  accidentDate: z.string().min(1, 'Accident date is required'),
  injuryDescription: z.string().min(10, 'Please provide more details about your injuries'),
  medicalTreatment: z.boolean(),
  propertyDamage: z.boolean(),
});

const locationSchema = z.object({
  state: z.string().min(2, 'State is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
});

const legalStatusSchema = z.object({
  hasAttorney: z.boolean(),
  policeReport: z.boolean(),
  insuranceClaim: z.boolean(),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

// Form steps configuration
const formSteps: FormStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us how to contact you',
    fields: ['firstName', 'lastName', 'email', 'phone'],
    validation: personalInfoSchema,
  },
  {
    id: 'accident',
    title: 'Accident Details',
    description: 'Help us understand what happened',
    fields: ['accidentType', 'accidentDate', 'injuryDescription', 'medicalTreatment', 'propertyDamage'],
    validation: accidentInfoSchema,
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Where did the accident occur?',
    fields: ['state', 'city', 'zipCode'],
    validation: locationSchema,
  },
  {
    id: 'legal',
    title: 'Legal Status',
    description: 'Final details about your case',
    fields: ['hasAttorney', 'policeReport', 'insuranceClaim', 'message', 'consent'],
    validation: legalStatusSchema,
  },
];

// Form context types
interface FormContextValue {
  state: FormState;
  steps: FormStep[];
  currentStep: FormStep;
  updateField: (field: keyof LeadFormData, value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  validateCurrentStep: () => boolean;
  getFieldError: (field: string) => string | undefined;
  touchField: (field: string) => void;
  isFieldTouched: (field: string) => boolean;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

// Form reducer actions
type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof LeadFormData; value: any }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'TOUCH_FIELD'; field: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_COMPLETE'; isComplete: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_STATE'; state: FormState };

// Form reducer
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: action.value,
        },
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'TOUCH_FIELD':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'SET_COMPLETE':
      return {
        ...state,
        isComplete: action.isComplete,
      };
    case 'RESET_FORM':
      return initialFormState;
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
};

// Initial form state
const initialFormState: FormState = {
  currentStep: 0,
  data: {},
  errors: {},
  touched: {},
  isSubmitting: false,
  isComplete: false,
};

// Smart defaults based on accident type
const getSmartDefaults = (accidentType: AccidentType): Partial<LeadFormData> => {
  const defaults: Partial<LeadFormData> = {
    medicalTreatment: true,
    propertyDamage: true,
    policeReport: true,
    insuranceClaim: false,
    hasAttorney: false,
  };

  switch (accidentType) {
    case AccidentType.CAR:
    case AccidentType.TRUCK:
    case AccidentType.MOTORCYCLE:
      return {
        ...defaults,
        policeReport: true,
        propertyDamage: true,
      };
    case AccidentType.SLIP_FALL:
      return {
        ...defaults,
        policeReport: false,
        propertyDamage: false,
      };
    case AccidentType.MEDICAL:
      return {
        ...defaults,
        policeReport: false,
        propertyDamage: false,
        medicalTreatment: true,
      };
    default:
      return defaults;
  }
};

// FormProvider component
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const { trackEvent, trackFormField, trackConversion, getAttribution } = useTracking();
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(Date.now());

  // Load saved form state on mount
  useEffect(() => {
    const loadSavedState = () => {
      // Try to load from cookie first
      const cookieData = getCookie(FORM_COOKIE_NAME);
      if (cookieData) {
        try {
          const savedState = JSON.parse(cookieData as string);
          dispatch({ type: 'LOAD_STATE', state: savedState });
          
          // Check if form is abandoned
          if (savedState.data.timestamp) {
            const timeSinceLastEdit = Date.now() - savedState.data.timestamp;
            if (timeSinceLastEdit > ABANDONED_FORM_THRESHOLD_MS && !savedState.isComplete) {
              trackEvent({
                category: 'Form',
                action: 'Abandoned Form Recovered',
                metadata: {
                  step: savedState.currentStep,
                  timeSinceLastEdit,
                },
                timestamp: Date.now()
              });
            }
          }
          return;
        } catch (e) {
          console.error('Failed to parse saved form state:', e);
        }
      }

      // Try localStorage as fallback
      try {
        const localData = localStorage.getItem(FORM_STORAGE_KEY);
        if (localData) {
          const savedState = JSON.parse(localData);
          dispatch({ type: 'LOAD_STATE', state: savedState });
        }
      } catch (e) {
        console.error('Failed to load form state from localStorage:', e);
      }
    };

    loadSavedState();
  }, [trackEvent]);

  // Save form state
  const saveFormState = useCallback(() => {
    const stateToSave = {
      ...state,
      data: {
        ...state.data,
        timestamp: Date.now(),
        ...getAttribution(),
      },
    };

    // Save to cookie
    setCookie(FORM_COOKIE_NAME, JSON.stringify(stateToSave), {
      maxAge: 60 * 60 * 24 * FORM_EXPIRY_DAYS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Save to localStorage as backup
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save form state to localStorage:', e);
    }

    lastSaveRef.current = Date.now();
  }, [state, getAttribution]);

  // Autosave form state
  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (Date.now() - lastSaveRef.current > AUTOSAVE_DELAY_MS) {
        saveFormState();
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [state, saveFormState]);

  // Update field
  const updateField = useCallback((field: keyof LeadFormData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
    trackFormField(field, 'change');

    // Apply smart defaults when accident type changes
    if (field === 'accidentType' && value) {
      const defaults = getSmartDefaults(value as AccidentType);
      Object.entries(defaults).forEach(([key, val]) => {
        if (state.data[key as keyof LeadFormData] === undefined) {
          dispatch({ type: 'UPDATE_FIELD', field: key as keyof LeadFormData, value: val });
        }
      });
    }
  }, [state.data, trackFormField]);

  // Touch field
  const touchField = useCallback((field: string) => {
    dispatch({ type: 'TOUCH_FIELD', field });
    trackFormField(field, 'blur');
  }, [trackFormField]);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const currentStepConfig = formSteps[state.currentStep];
    if (!currentStepConfig.validation) return true;

    try {
      const stepData: any = {};
      currentStepConfig.fields.forEach(field => {
        stepData[field] = state.data[field as keyof LeadFormData];
      });

      currentStepConfig.validation.parse(stepData);
      dispatch({ type: 'SET_ERRORS', errors: {} });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        dispatch({ type: 'SET_ERRORS', errors });
      }
      return false;
    }
  }, [state.currentStep, state.data]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (validateCurrentStep() && state.currentStep < formSteps.length - 1) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
      trackConversion({
        type: ConversionType.FORM_STEP,
        value: state.currentStep + 1,
        metadata: {
          stepName: formSteps[state.currentStep + 1].id,
        },
      });
      saveFormState();
    }
  }, [state.currentStep, validateCurrentStep, trackConversion, saveFormState]);

  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_STEP', step: state.currentStep - 1 });
      trackEvent({
        category: 'Form',
        action: 'Previous Step',
        label: formSteps[state.currentStep - 1].id,
        timestamp: Date.now()
      });
    }
  }, [state.currentStep, trackEvent]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < formSteps.length) {
      dispatch({ type: 'SET_STEP', step: stepIndex });
      trackEvent({
        category: 'Form',
        action: 'Jump to Step',
        label: formSteps[stepIndex].id,
        value: stepIndex,
        timestamp: Date.now()
      });
    }
  }, [trackEvent]);

  // Submit form
  const submitForm = useCallback(async () => {
    if (!validateCurrentStep()) return;

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });

    try {
      const formData: LeadFormData = {
        ...state.data as LeadFormData,
        ...getAttribution(),
        timestamp: Date.now(),
      };

      const response = await fetch(process.env.NEXT_PUBLIC_FORM_SUBMISSION_ENDPOINT || '/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      dispatch({ type: 'SET_COMPLETE', isComplete: true });
      
      // Track conversion
      trackConversion({
        type: ConversionType.FORM_COMPLETE,
        metadata: {
          accidentType: formData.accidentType,
          hasAttorney: formData.hasAttorney,
        },
      });

      // Clear saved state
      setCookie(FORM_COOKIE_NAME, '', { maxAge: 0 });
      localStorage.removeItem(FORM_STORAGE_KEY);

    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent({
        category: 'Form',
        action: 'Submission Error',
        label: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [state.data, validateCurrentStep, getAttribution, trackConversion, trackEvent]);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    setCookie(FORM_COOKIE_NAME, '', { maxAge: 0 });
    localStorage.removeItem(FORM_STORAGE_KEY);
    trackEvent({
      category: 'Form',
      action: 'Reset',
      timestamp: Date.now()
    });
  }, [trackEvent]);

  // Helper functions
  const getFieldError = useCallback((field: string): string | undefined => {
    return state.touched[field] ? state.errors[field] : undefined;
  }, [state.errors, state.touched]);

  const isFieldTouched = useCallback((field: string): boolean => {
    return !!state.touched[field];
  }, [state.touched]);

  const currentStep = formSteps[state.currentStep];

  const contextValue: FormContextValue = {
    state,
    steps: formSteps,
    currentStep,
    updateField,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    resetForm,
    validateCurrentStep,
    getFieldError,
    touchField,
    isFieldTouched,
  };

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
};

// Hook to use form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}; 