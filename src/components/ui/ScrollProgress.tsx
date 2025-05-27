/**
 * Scroll Progress Indicator
 * Shows a progress bar that fills as the user scrolls down the page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTracking } from '@/hooks/useTracking';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const { trackScrollDepth } = useTracking();
  const [hasTracked25, setHasTracked25] = useState(false);
  const [hasTracked50, setHasTracked50] = useState(false);
  const [hasTracked75, setHasTracked75] = useState(false);
  const [hasTracked100, setHasTracked100] = useState(false);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track scroll depth milestones
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const percentage = Math.round(latest * 100);

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
    });

    return () => unsubscribe();
  }, [scrollYProgress, trackScrollDepth, hasTracked25, hasTracked50, hasTracked75, hasTracked100]);

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 transform-origin-left z-100"
        style={{ scaleX }}
      />

      {/* Progress Percentage (optional, hidden by default) */}
      <motion.div
        className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-lg z-90 hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span>
          {scrollYProgress.get() > 0 ? `${Math.round(scrollYProgress.get() * 100)}%` : ''}
        </motion.span>
      </motion.div>

      {/* Mobile Progress Dot */}
      <motion.div
        className="fixed bottom-20 right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-90 md:hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <motion.span>
          {Math.round(scrollYProgress.get() * 100)}%
        </motion.span>
      </motion.div>

      {/* Scroll to Top Button (appears after scrolling) */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-90"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: scrollYProgress.get() > 0.1 ? 1 : 0,
          scale: scrollYProgress.get() > 0.1 ? 1 : 0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
    </>
  );
}; 