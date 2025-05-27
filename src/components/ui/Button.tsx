/**
 * Button component with variants, loading states, and tracking
 */

'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { ButtonProps as ButtonPropsType } from '@/types';
import { useTracking } from '@/hooks/useTracking';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
        xl: 'text-xl px-8 py-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  tracking?: {
    category: string;
    action: string;
    label?: string;
  };
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant,
    size,
    loading = false,
    disabled,
    icon,
    fullWidth = false,
    tracking,
    onClick,
    children,
    ...props
  }, ref) => {
    const { trackEvent } = useTracking();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track button click if tracking config provided
      if (tracking) {
        trackEvent({
          category: tracking.category,
          action: tracking.action,
          label: tracking.label,
          timestamp: Date.now()
        });
      }

      // Call original onClick handler
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
        {icon && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button'; 