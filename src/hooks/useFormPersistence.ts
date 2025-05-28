/**
 * Hook for persisting form data across sessions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

interface UseFormPersistenceOptions {
  storageKey?: string;
  cookieKey?: string;
  expiryDays?: number;
}

export function useFormPersistence<T extends Record<string, any>>(
  key: string,
  initialData: T,
  options: UseFormPersistenceOptions = {}
) {
  const {
    storageKey = `form_${key}`,
    cookieKey = `form_cookie_${key}`,
    expiryDays = 7,
  } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    const loadPersistedData = () => {
      try {
        // Try to load from cookie first
        const cookieData = getCookie(cookieKey);
        if (cookieData) {
          const parsedData = JSON.parse(cookieData as string);
          setFormData({ ...initialData, ...parsedData });
          setIsLoaded(true);
          return;
        }

        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const localData = localStorage.getItem(storageKey);
          if (localData) {
            const parsedData = JSON.parse(localData);
            setFormData({ ...initialData, ...parsedData });
          }
        }
      } catch (error) {
        console.error('Error loading persisted form data:', error);
      }
      setIsLoaded(true);
    };

    loadPersistedData();
  }, [cookieKey, storageKey, initialData]);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = () => {
      try {
        const dataToSave = JSON.stringify(formData);
        
        // Save to cookie
        setCookie(cookieKey, dataToSave, {
          maxAge: 60 * 60 * 24 * expiryDays,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        // Save to localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, dataToSave);
        }
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded, cookieKey, storageKey, expiryDays]);

  // Update form data
  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Clear persisted data
  const clearFormData = useCallback(() => {
    setFormData(initialData);
    deleteCookie(cookieKey);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [initialData, cookieKey, storageKey]);

  // Reset to initial data without clearing persistence
  const resetFormData = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return {
    formData,
    updateFormData,
    clearFormData,
    resetFormData,
    isLoaded,
  };
} 