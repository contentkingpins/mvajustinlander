/**
 * Form Persistence Hook - Optimized
 * Persists form data to localStorage/cookies with debounced saving
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import { debounce } from '@/lib/utils';

interface UseFormPersistenceOptions {
  useCookies?: boolean;
  cookieExpiry?: number; // days
  debounceMs?: number; // debounce save operations
}

export function useFormPersistence<T extends Record<string, any>>(
  key: string,
  initialData: T,
  options: UseFormPersistenceOptions = {}
) {
  const {
    useCookies = false,
    cookieExpiry = 7,
    debounceMs = 300,
  } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialized = useRef(false);

  // Debounced save function to reduce storage calls
  const debouncedSave = useCallback(
    debounce((data: T) => {
      try {
        const dataToStore = JSON.stringify(data);
        
        if (useCookies) {
          setCookie(key, dataToStore, {
            maxAge: 60 * 60 * 24 * cookieExpiry,
            sameSite: 'lax',
          });
        } else {
          localStorage.setItem(key, dataToStore);
        }
      } catch (error) {
        console.warn('Failed to persist form data:', error);
      }
    }, debounceMs),
    [key, useCookies, cookieExpiry, debounceMs]
  );

  // Load data on mount
  useEffect(() => {
    if (isInitialized.current) return;
    
    try {
      const stored = useCookies 
        ? getCookie(key) 
        : (typeof window !== 'undefined' ? localStorage.getItem(key) : null);
      
      if (stored) {
        const parsed = JSON.parse(stored as string);
        setFormData({ ...initialData, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load persisted form data:', error);
    } finally {
      setIsLoaded(true);
      isInitialized.current = true;
    }
  }, [key, initialData, useCookies]);

  // Save data when formData changes (debounced)
  useEffect(() => {
    if (!isLoaded) return;
    
    // Only save if data has actually changed from initial
    const hasChanges = Object.keys(formData).some(
      k => formData[k] !== initialData[k]
    );
    
    if (hasChanges) {
      debouncedSave(formData);
    }
  }, [formData, isLoaded, debouncedSave, initialData]);

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFormData = useCallback(() => {
    setFormData(initialData);
    try {
      if (useCookies) {
        setCookie(key, '', { maxAge: 0 });
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Failed to clear form data:', error);
    }
  }, [key, initialData, useCookies]);

  return {
    formData,
    updateFormData,
    clearFormData,
    isLoaded,
  };
} 