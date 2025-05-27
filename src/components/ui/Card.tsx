/**
 * Card Component
 * Reusable card with variants and animations
 */

'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { CardProps } from '@/types';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    title, 
    description, 
    icon, 
    image, 
    actions, 
    className, 
    children, 
    animate = false, 
    animationDelay = 0,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white shadow-sm transition-all',
          animate && 'animate-fade-in',
          className
        )}
        style={{
          animationDelay: animate ? `${animationDelay}ms` : undefined
        }}
        {...props}
      >
        {image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={image}
              alt={title || 'Card image'}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div className={cn('p-6', image && 'pt-4')}>
          {icon && (
            <div className="mb-4">
              {icon}
            </div>
          )}
          
          {title && (
            <h3 className="text-xl font-semibold mb-2">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="text-gray-600 mb-4">
              {description}
            </p>
          )}
          
          {children}
          
          {actions && (
            <div className="mt-4 flex gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card'; 