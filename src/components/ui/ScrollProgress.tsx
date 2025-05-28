/**
 * Scroll to Top Button - Simplified
 * Shows only an arrow button to scroll to top
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useTracking } from '@/hooks/useTracking';

export const ScrollProgress: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
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

    // Show button after scrolling down a bit
    setShowButton(scrollTop > 300);

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
    <AnimatePresence>
      {showButton && (
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}; 