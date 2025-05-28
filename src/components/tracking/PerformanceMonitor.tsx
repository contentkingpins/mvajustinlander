'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance';

export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring when the component mounts
    initPerformanceMonitoring();
  }, []);

  // This component doesn't render anything
  return null;
} 