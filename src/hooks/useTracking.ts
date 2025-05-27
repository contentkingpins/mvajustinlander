/**
 * Custom tracking hook that captures UTM parameters and sends to multiple platforms
 * Works with ad blockers by using first-party tracking methods
 */

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie } from 'cookies-next';
import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import { UTMParams, TrackingEvent, TrackingContext, ConversionEvent } from '@/types';

// Constants
const TRACKING_COOKIE_NAME = 'mvaj_tracking';
const SESSION_COOKIE_NAME = 'mvaj_session';
const UTM_COOKIE_NAME = 'mvaj_utm';
const COOKIE_EXPIRY_DAYS = 30;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Initialize tracking platforms
const initializeTrackers = () => {
  // Google Analytics 4
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true,
        cookieFlags: 'SameSite=None; Secure'
      }
    });
  }

  // Facebook Pixel
  if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
    ReactPixel.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID, undefined, {
      autoConfig: true,
      debug: process.env.NODE_ENV === 'development'
    });
  }

  // Google Tag Manager
  if (process.env.NEXT_PUBLIC_GTM_ID && typeof window !== 'undefined') {
    (function(w: any, d: Document, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode?.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', process.env.NEXT_PUBLIC_GTM_ID);
  }
};

/**
 * Extract UTM parameters from URL
 */
const extractUTMParams = (url: string): UTMParams => {
  const params = new URLSearchParams(new URL(url).search);
  
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
    msclkid: params.get('msclkid') || undefined,
  };
};

/**
 * Store tracking data in multiple storage methods
 */
const storeTrackingData = (data: any, key: string) => {
  // Store in cookies (works with ad blockers)
  setCookie(key, JSON.stringify(data), {
    maxAge: 60 * 60 * 24 * COOKIE_EXPIRY_DAYS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  // Store in localStorage as backup
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage not available:', e);
    }
  }

  // Store in sessionStorage for current session
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('sessionStorage not available:', e);
    }
  }
};

/**
 * Retrieve tracking data from storage
 */
const getTrackingData = (key: string): any => {
  // Try cookies first
  const cookieData = getCookie(key);
  if (cookieData) {
    try {
      return JSON.parse(cookieData as string);
    } catch (e) {}
  }

  // Try localStorage
  if (typeof window !== 'undefined') {
    try {
      const localData = localStorage.getItem(key);
      if (localData) return JSON.parse(localData);
    } catch (e) {}
  }

  // Try sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const sessionData = sessionStorage.getItem(key);
      if (sessionData) return JSON.parse(sessionData);
    } catch (e) {}
  }

  return null;
};

/**
 * Generate unique session ID
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Send event to first-party analytics endpoint
 */
const sendToFirstParty = async (event: TrackingEvent) => {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) return;

  try {
    await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      keepalive: true // Ensures request completes even if page unloads
    });
  } catch (error) {
    console.error('Failed to send analytics:', error);
  }
};

/**
 * Main tracking hook
 */
export const useTracking = () => {
  const router = useRouter();
  const sessionRef = useRef<string | null>(null);
  const utmRef = useRef<UTMParams>({});
  const contextRef = useRef<TrackingContext | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Initialize tracking on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize third-party trackers
    initializeTrackers();

    // Get or create session
    let session = getTrackingData(SESSION_COOKIE_NAME);
    if (!session || Date.now() - session.lastActivity > SESSION_TIMEOUT_MS) {
      session = {
        id: generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now()
      };
    }
    sessionRef.current = session.id;
    storeTrackingData(session, SESSION_COOKIE_NAME);

    // Extract and store UTM parameters
    const utm = extractUTMParams(window.location.href);
    if (Object.keys(utm).some(key => utm[key as keyof UTMParams])) {
      utmRef.current = utm;
      storeTrackingData(utm, UTM_COOKIE_NAME);
    } else {
      // Try to get existing UTM data
      const existingUTM = getTrackingData(UTM_COOKIE_NAME);
      if (existingUTM) {
        utmRef.current = existingUTM;
      }
    }

    // Build tracking context
    contextRef.current = {
      utm: utmRef.current,
      referrer: document.referrer,
      landingPage: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    // Track initial page view
    trackPageView(window.location.pathname);

    // Set up activity tracking
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      const session = getTrackingData(SESSION_COOKIE_NAME);
      if (session) {
        session.lastActivity = Date.now();
        storeTrackingData(session, SESSION_COOKIE_NAME);
      }
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Track page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent({
          category: 'Engagement',
          action: 'Page Hidden',
          timestamp: Date.now()
        });
      } else {
        trackEvent({
          category: 'Engagement',
          action: 'Page Visible',
          timestamp: Date.now()
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  /**
   * Track page view
   */
  const trackPageView = useCallback((path: string, title?: string) => {
    if (!sessionRef.current) return;

    // Send to GA4
    ReactGA.send({ 
      hitType: "pageview", 
      page: path,
      title: title || document.title
    });

    // Send to Facebook Pixel
    ReactPixel.pageView();

    // Send to first-party
    const event: TrackingEvent = {
      category: 'Page View',
      action: path,
      label: title || document.title,
      timestamp: Date.now(),
      sessionId: sessionRef.current,
      metadata: {
        ...contextRef.current,
        scrollDepth: 0,
        timeOnPage: 0
      }
    };
    sendToFirstParty(event);
  }, []);

  /**
   * Track custom event
   */
  const trackEvent = useCallback((event: Omit<TrackingEvent, 'sessionId'>) => {
    if (!sessionRef.current) return;

    const fullEvent: TrackingEvent = {
      ...event,
      sessionId: sessionRef.current,
      timestamp: event.timestamp || Date.now()
    };

    // Send to GA4
    ReactGA.event({
      category: fullEvent.category,
      action: fullEvent.action,
      label: fullEvent.label,
      value: fullEvent.value,
      ...fullEvent.metadata
    });

    // Send to Facebook Pixel
    if (fullEvent.category === 'Conversion') {
      ReactPixel.track(fullEvent.action, fullEvent.metadata);
    }

    // Send to first-party
    sendToFirstParty(fullEvent);
  }, []);

  /**
   * Track conversion event
   */
  const trackConversion = useCallback((conversion: ConversionEvent) => {
    trackEvent({
      category: 'Conversion',
      action: conversion.type,
      value: conversion.value,
      metadata: {
        ...conversion.metadata,
        ...contextRef.current
      },
      timestamp: Date.now()
    });

    // Send enhanced conversion to Facebook
    if (conversion.metadata?.email) {
      ReactPixel.track('Lead', {
        value: conversion.value,
        currency: 'USD',
        ...conversion.metadata
      });
    }
  }, [trackEvent]);

  /**
   * Track form field interaction
   */
  const trackFormField = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackEvent({
      category: 'Form Interaction',
      action: `Field ${action}`,
      label: fieldName,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  /**
   * Track scroll depth
   */
  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent({
      category: 'Engagement',
      action: 'Scroll Depth',
      value: depth,
      timestamp: Date.now()
    });
  }, [trackEvent]);

  /**
   * Get attribution data
   */
  const getAttribution = useCallback(() => {
    return {
      utm: utmRef.current,
      sessionId: sessionRef.current,
      referrer: contextRef.current?.referrer,
      landingPage: contextRef.current?.landingPage
    };
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    trackFormField,
    trackScrollDepth,
    getAttribution,
    utm: utmRef.current,
    sessionId: sessionRef.current
  };
};

// Export singleton instance for use outside of React components
export const tracking = {
  trackEvent: (event: Omit<TrackingEvent, 'sessionId'>) => {
    const sessionId = getTrackingData(SESSION_COOKIE_NAME)?.id || generateSessionId();
    sendToFirstParty({ ...event, sessionId });
  }
}; 