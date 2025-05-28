/**
 * FormProvider component that manages form modal state
 * Simplified to work with MultiStepAccidentForm
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// Modal context types
interface ModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

// FormProvider component
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal functions
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen: isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useFormModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useFormModal must be used within FormProvider');
  }
  return context;
}; 