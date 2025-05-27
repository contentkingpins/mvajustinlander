/**
 * Scroll Progress Indicator - Performance Optimized
 * Shows a progress bar that fills as the user scrolls down the page
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTracking } from '@/hooks/useTracking';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { trackScrollDepth } = useTracking();
  const [hasTracked25, setHasTracked25] = useState(false);
  const [hasTracked50, setHasTracked50] = useState(false);
  const [hasTracked75, setHasTracked75] = useState(false);
  const [hasTracked100, setHasTracked100] = useState(false);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);
    const percentage = Math.round(progress * 100);

    setScrollProgress(progress);

    // Track scroll depth milestones
    if (percentage >= 25 && !hasTracked25) {
      trackScrollDepth(25);
      setHasTracked25(true);
    }
    if (percentage >= 50 && !hasTracked50) {
      trackScrollDepth(50);
      setHasTracked50(true);
    }
    if (percentage >= 75 && !hasTracked75) {
      trackScrollDepth(75);
      setHasTracked75(true);
    }
    if (percentage >= 95 && !hasTracked100) {
      trackScrollDepth(100);
      setHasTracked100(true);
    }
  }, [trackScrollDepth, hasTracked25, hasTracked50, hasTracked75, hasTracked100]);

  // Throttle scroll events for performance
  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Scroll to Top Button (appears after scrolling) */}
      {scrollProgress > 0.1 && (
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}

      {/* Mobile Progress Indicator */}
      <div className="fixed bottom-20 right-4 md:hidden">
        {scrollProgress > 0.05 && (
          <motion.div
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-40"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
          >
            {Math.round(scrollProgress * 100)}%
          </motion.div>
        )}
      </div>
    </>
  );
}; 