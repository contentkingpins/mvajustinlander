/**
 * Phone Button Component
 * Reusable button for phone calls with device-aware handling
 */

'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from './Button';
import { deviceUtils, formatPhoneNumber } from '@/lib/utils';

interface PhoneButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showNumber?: boolean;
  children?: React.ReactNode;
}

export const PhoneButton: React.FC<PhoneButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showNumber = true,
  children
}) => {
  const handlePhoneClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567';
    deviceUtils.handlePhoneClick(phoneNumber);
  };

  const displayPhone = formatPhoneNumber(process.env.NEXT_PUBLIC_BUSINESS_PHONE || '(555) 123-4567');

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePhoneClick}
      className={`flex items-center gap-2 min-h-[44px] ${className}`}
      aria-label="Call now"
    >
      <Phone className="w-4 h-4" />
      {children || (showNumber ? `Call ${displayPhone}` : 'Call Now')}
    </Button>
  );
}; 