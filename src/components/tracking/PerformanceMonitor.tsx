/**
 * Performance Monitor Component - Lazy Loaded
 * Monitors Core Web Vitals and performance metrics
 */

'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Dynamically import performance monitoring to reduce initial bundle
    const initPerformanceMonitoring = async () => {
      try {
        const { initPerformanceMonitoring } = await import('@/lib/performance');
        // Delay initialization to not block critical rendering
        setTimeout(() => {
          initPerformanceMonitoring();
        }, 100);
      } catch (error) {
        console.warn('Failed to load performance monitoring:', error);
      }
    };

    initPerformanceMonitoring();
  }, []);

  // This component doesn't render anything
  return null;
} 