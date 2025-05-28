/**
 * Tracking utilities for analytics and conversion tracking
 */

import { getCookie } from 'cookies-next';

export interface TrackingEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track an event to Google Analytics
 */
export function trackEvent({ event, category, label, value, ...additionalData }: TrackingEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: category,
      event_label: label,
      value,
      ...additionalData,
    });
  }
}

/**
 * Track a conversion event
 */
export function trackConversion(conversionType: string, value?: number) {
  // Google Analytics conversion
  trackEvent({
    event: 'conversion',
    category: 'engagement',
    label: conversionType,
    value,
  });

  // Google Ads conversion (if configured)
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID) {
    window.gtag('event', 'conversion', {
      send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID}`,
      value: value || 0,
      currency: 'USD',
    });
  }

  // Facebook Pixel conversion
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      value: value || 0,
      currency: 'USD',
      content_name: conversionType,
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  return utmParams;
}

/**
 * Store UTM parameters in cookies
 */
export function storeUTMParams() {
  const utmParams = getUTMParams();
  
  Object.entries(utmParams).forEach(([key, value]) => {
    document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
  });
}

/**
 * Get stored UTM parameters from cookies
 */
export function getStoredUTMParams(): Record<string, string> {
  const utmParams: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = getCookie(param);
    if (value) {
      utmParams[param] = value as string;
    }
  });

  return utmParams;
}

/**
 * Track form step completion
 */
export function trackFormStep(formName: string, step: number) {
  trackEvent({
    event: 'form_step',
    category: 'form_interaction',
    label: formName,
    value: step,
    form_name: formName,
    step_number: step,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, formData?: any) {
  // Track the submission event
  trackEvent({
    event: 'form_submit',
    category: 'form_interaction',
    label: formName,
    form_name: formName,
  });

  // Track as a conversion
  trackConversion(`${formName}_submission`);

  // Track additional form data if provided (be careful with PII)
  if (formData) {
    // Only track non-PII data
    const safeData = {
      accident_type: formData.accidentType,
      role: formData.role,
      at_fault: formData.atFault,
      medical_attention: formData.medicalAttention,
      has_description: !!formData.description,
    };

    trackEvent({
      event: 'form_details',
      category: 'form_data',
      label: formName,
      ...safeData,
    });
  }
}

/**
 * Track phone call clicks
 */
export function trackPhoneCall(source: string) {
  trackEvent({
    event: 'phone_call_click',
    category: 'engagement',
    label: source,
  });

  // Track as conversion
  trackConversion('phone_call');
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number) {
  trackEvent({
    event: 'scroll',
    category: 'engagement',
    label: `${percentage}%`,
    value: percentage,
  });
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number) {
  trackEvent({
    event: 'time_on_page',
    category: 'engagement',
    label: `${seconds} seconds`,
    value: seconds,
  });
} 