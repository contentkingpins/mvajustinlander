/**
 * Form Modal Component
 * Manages the display of the accident form modal
 */

'use client';

import React from 'react';
import { useFormModal } from '@/providers/FormProvider';
import { MultiStepAccidentForm } from './MultiStepAccidentForm';

export const FormModal: React.FC = () => {
  const { isOpen, closeModal } = useFormModal();

  return <MultiStepAccidentForm isOpen={isOpen} onClose={closeModal} />;
};
