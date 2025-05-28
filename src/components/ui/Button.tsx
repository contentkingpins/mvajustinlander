/**
 * Button Component
 * Reusable button with variants, sizes, and tracking - Mobile Optimized
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';
import { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  children,
  tracking,
  ...props
}) => {
  const { trackEvent } = useTracking();

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  // Enhanced mobile-first size classes with proper touch targets
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[44px]', // Increased from py-2 to py-3
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    xl: 'px-8 py-4 text-xl min-h-[52px]',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    // Ensure minimum touch target on mobile
    'min-w-[44px]',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (disabled || loading) return;

    // Track button click if tracking config provided
    if (tracking) {
      trackEvent({
        category: tracking.category,
        action: tracking.action,
        label: tracking.label,
        timestamp: Date.now(),
        sessionId: Date.now().toString(),
      });
    }

    onClick?.();
  };

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      // Enhanced accessibility
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
      )}
      
      <span className="flex items-center gap-2">
        {children}
        {icon && !loading && (
          <span aria-hidden="true">{icon}</span>
        )}
      </span>
    </motion.button>
  );
}; 