/**
 * Custom tracking hook that captures UTM parameters and sends to multiple platforms
 * Works with ad blockers by using first-party tracking methods
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie } from 'cookies-next';
import { UTMParams, TrackingEvent, TrackingContext, ConversionEvent, ConversionType } from '@/types';

// Lazy load tracking libraries to avoid SSR issues
let ReactGA: any;
let ReactPixel: any;

if (typeof window !== 'undefined') {
  ReactGA = require('react-ga4');
  ReactPixel = require('react-facebook-pixel');
}

// Constants
const TRACKING_COOKIE_NAME = 'mvaj_tracking';
const SESSION_COOKIE_NAME = 'mvaj_session';
const UTM_COOKIE_NAME = 'mvaj_utm';
const COOKIE_EXPIRY_DAYS = 30;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Initialize tracking platforms
const initializeTrackers = () => {
  // Skip initialization on server
  if (typeof window === 'undefined' || !ReactGA || !ReactPixel) return;
  
  // Google Analytics 4
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    ReactGA.default.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true,
        cookieFlags: 'SameSite=None; Secure'
      }
    });
  }

  // Facebook Pixel
  if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
    ReactPixel.default.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID, undefined, {
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
 * Simplified Performance-Optimized Tracking Hook
 * Lightweight analytics with lazy loading
 */
export const useTracking = () => {
  const router = useRouter();
  const sessionRef = useRef<string | null>(null);
  const utmRef = useRef<UTMParams>({});
  const contextRef = useRef<TrackingContext | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [isInitialized, setIsInitialized] = useState(false);
  const [gtag, setGtag] = useState<any>(null);
  const [fbPixel, setFbPixel] = useState<any>(null);

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
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname);
    }

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
          timestamp: Date.now(),
          sessionId: sessionRef.current || Date.now().toString(),
        });
      } else {
        trackEvent({
          category: 'Engagement',
          action: 'Page Visible',
          timestamp: Date.now(),
          sessionId: sessionRef.current || Date.now().toString(),
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

  // Initialize tracking libraries
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized) return;

    const initializeTracking = async () => {
      try {
        // Load analytics libraries in parallel
        const [gtagLib, fbPixelLib] = await Promise.all([
          loadGoogleAnalytics(),
          loadFacebookPixel(),
        ]);

        setGtag(gtagLib);
        setFbPixel(fbPixelLib);

        // Initialize Facebook Pixel if available
        if (fbPixelLib && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
          fbPixelLib.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
        }

        setIsInitialized(true);
      } catch (error) {
        console.warn('Failed to initialize tracking:', error);
      }
    };

    // Delay initialization to not block critical rendering
    const timer = setTimeout(initializeTracking, 1000);
    return () => clearTimeout(timer);
  }, [isInitialized]);

  /**
   * Track page view
   */
  const trackPageView = useCallback((path?: string) => {
    if (typeof window === 'undefined') return;
    
    const pagePath = path || window.location.pathname;
    
    // Google Analytics
    if (gtag && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath,
      });
    }

    // Facebook Pixel
    if (fbPixel) {
      fbPixel.pageView();
    }

    // First-party analytics
    sendToAnalytics('page_view', { page: pagePath });
  }, [gtag, fbPixel]);

  /**
   * Track custom event
   */
  const trackEvent = useCallback((event: TrackingEvent) => {
    if (typeof window === 'undefined') return;
    
    // Google Analytics
    if (gtag) {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    // Facebook Pixel
    if (fbPixel) {
      fbPixel.track(event.action, event.metadata);
    }

    // First-party analytics
    sendToAnalytics('event', event);
  }, [gtag, fbPixel]);

  /**
   * Track conversion event
   */
  const trackConversion = useCallback((conversion: ConversionEvent) => {
    if (typeof window === 'undefined') return;
    
    const utmParams = extractUTMParams(window.location.href);
    const conversionData = {
      ...conversion,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      utm_params: utmParams,
    };

    // Google Analytics
    if (gtag) {
      gtag('event', 'conversion', {
        event_category: 'engagement',
        event_label: conversion.type,
        value: conversion.value || 1,
        ...conversion.metadata,
      });
    }

    // Facebook Pixel
    if (fbPixel) {
      const fbEventName = getFacebookEventName(conversion.type);
      fbPixel.track(fbEventName, {
        content_name: conversion.type,
        ...conversion.metadata,
      });
    }

    // First-party analytics
    sendToAnalytics('conversion', conversionData);
  }, [gtag, fbPixel]);

  /**
   * Track form field interaction
   */
  const trackFormField = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackEvent({
      category: 'Form Interaction',
      action: `Field ${action}`,
      label: fieldName,
      timestamp: Date.now(),
      sessionId: sessionRef.current || Date.now().toString(),
    });
  }, [trackEvent]);

  /**
   * Track scroll depth
   */
  const trackScrollDepth = useCallback((percentage: number) => {
    if (typeof window === 'undefined') return;
    
    const event: TrackingEvent = {
      action: 'scroll_depth',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
      timestamp: Date.now(),
      sessionId: Date.now().toString(),
    };
    
    trackEvent(event);
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

  // Get UTM parameters
  const getUtmParams = useCallback(() => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || 'direct',
      utm_medium: urlParams.get('utm_medium') || 'none',
      utm_campaign: urlParams.get('utm_campaign') || 'none',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
    };
  }, []);

  // Store UTM parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const utmParams = getUtmParams();
    if (utmParams.utm_source !== 'direct') {
      try {
        localStorage.setItem('utm_params', JSON.stringify(utmParams));
        
        // Set cookie for server-side access
        document.cookie = `utm_params=${JSON.stringify(utmParams)}; path=/; max-age=2592000`; // 30 days
      } catch (error) {
        console.warn('Failed to store UTM parameters:', error);
      }
    }
  }, [getUtmParams]);

  // Send to first-party analytics
  const sendToAnalytics = useCallback(async (type: string, data: any) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Use sendBeacon for better performance
      if (navigator.sendBeacon) {
        const payload = JSON.stringify({ type, data, timestamp: Date.now() });
        navigator.sendBeacon('/api/analytics', payload);
      } else {
        // Fallback to fetch
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, data, timestamp: Date.now() }),
        }).catch(() => {}); // Fail silently
      }
    } catch (error) {
      // Fail silently for analytics
    }
  }, []);

  // Map conversion types to GA4 events
  const conversionTypeMap: Record<ConversionType, string> = {
    [ConversionType.FORM_START]: 'generate_lead',
    [ConversionType.FORM_SUBMIT]: 'submit_lead_form',
    [ConversionType.PHONE_CLICK]: 'Contact',
    [ConversionType.EMAIL_CLICK]: 'Contact',
  };

  // Map conversion types to Facebook events
  const fbEventMap: Record<ConversionType, string> = {
    [ConversionType.FORM_START]: 'InitiateCheckout',
    [ConversionType.FORM_SUBMIT]: 'Lead',
    [ConversionType.PHONE_CLICK]: 'Contact',
    [ConversionType.EMAIL_CLICK]: 'Contact',
  };

  // Get Facebook event name
  const getFacebookEventName = (type: ConversionType): string => {
    return fbEventMap[type] || 'CustomEvent';
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    trackFormField,
    trackScrollDepth,
    getAttribution,
    utm: utmRef.current,
    sessionId: sessionRef.current,
    isInitialized,
  };
};

// Export singleton instance for use outside of React components
export const tracking = {
  trackEvent: (event: Omit<TrackingEvent, 'sessionId'>) => {
    const sessionId = getTrackingData(SESSION_COOKIE_NAME)?.id || generateSessionId();
    sendToFirstParty({ ...event, sessionId });
  }
};

// Lazy load analytics libraries
const loadGoogleAnalytics = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Use global gtag if available
    return window.gtag || null;
  } catch (error) {
    console.warn('Failed to load Google Analytics:', error);
    return null;
  }
};

const loadFacebookPixel = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const { default: ReactPixel } = await import('react-facebook-pixel');
    return ReactPixel;
  } catch (error) {
    console.warn('Failed to load Facebook Pixel:', error);
    return null;
  }
};

// Extend Window interface for global analytics
declare global {
  interface Window {
    gtag?: any;
    fbq?: any;
  }
} 