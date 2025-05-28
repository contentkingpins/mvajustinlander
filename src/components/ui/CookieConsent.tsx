/**
 * Cookie Consent Banner
 * GDPR/CCPA compliant cookie consent management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { setCookie, getCookie } from 'cookies-next';
import { CookieConsent as CookieConsentType } from '@/types';
import { useTracking } from '@/hooks/useTracking';

const CONSENT_COOKIE_NAME = 'mvaj_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsentType>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
  const { trackEvent } = useTracking();

  useEffect(() => {
    // Check for existing consent
    const existingConsent = getCookie(CONSENT_COOKIE_NAME);
    if (!existingConsent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const parsed = JSON.parse(existingConsent as string);
        setConsent(parsed);
        applyConsent(parsed);
      } catch (e) {
        console.error('Failed to parse consent cookie:', e);
      }
    }
  }, []);

  const applyConsent = (consentSettings: CookieConsentType) => {
    // Apply consent settings to various tracking services
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': consentSettings.marketing ? 'granted' : 'denied',
          'analytics_storage': consentSettings.analytics ? 'granted' : 'denied',
        });
      }

      // Facebook Pixel
      if (window.fbq) {
        if (consentSettings.marketing) {
          window.fbq('consent', 'grant');
        } else {
          window.fbq('consent', 'revoke');
        }
      }
    }
  };

  const saveConsent = (consentSettings: CookieConsentType) => {
    // Save consent with timestamp
    const consentData = {
      ...consentSettings,
      timestamp: Date.now(),
      ip: 'anonymized', // Should be set server-side
    };

    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(consentData), {
      maxAge: 60 * 60 * 24 * CONSENT_EXPIRY_DAYS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    applyConsent(consentSettings);
    setShowBanner(false);
    setShowSettings(false);

    // Track consent event
    trackEvent({
      category: 'Privacy',
      action: 'Cookie Consent',
      label: JSON.stringify(consentSettings),
      timestamp: Date.now(),
      sessionId: Date.now().toString(),
    });
  };

  const acceptAll = () => {
    const fullConsent: CookieConsentType = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setConsent(fullConsent);
    saveConsent(fullConsent);
  };

  const rejectAll = () => {
    const minimalConsent: CookieConsentType = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setConsent(minimalConsent);
    saveConsent(minimalConsent);
  };

  const saveCustom = () => {
    saveConsent(consent);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-90"
            onClick={() => setShowSettings(false)}
          />

          {/* Main Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-100 border-t-2 border-blue-200"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <Cookie className="w-8 h-8 text-blue-600 flex-shrink-0" />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900">
                    We value your privacy 🍪
                  </h3>
                  <p className="text-sm text-blue-700">
                    We use cookies to improve your experience and analyze site usage. By continuing, you agree to our use of cookies.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(!showSettings)}
                    className="min-w-[120px] min-h-[44px] order-2 sm:order-1"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={rejectAll}
                    className="min-w-[120px] min-h-[44px] order-3 sm:order-2"
                  >
                    Reject All
                  </Button>
                  <Button
                    variant="primary"
                    onClick={acceptAll}
                    className="min-w-[120px] min-h-[44px] order-1 sm:order-3"
                  >
                    Accept All
                  </Button>
                </div>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 pt-6 border-t border-blue-200"
                  >
                    <h4 className="font-semibold mb-4 text-blue-900">Cookie Settings</h4>
                    
                    <div className="space-y-4">
                      {/* Essential Cookies */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">Essential Cookies</h5>
                          <p className="text-sm text-blue-700">
                            Required for the website to function properly. Cannot be disabled.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked
                          disabled
                          className="mt-1"
                        />
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">Analytics Cookies</h5>
                          <p className="text-sm text-blue-700">
                            Help us understand how visitors interact with our website.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={consent.analytics}
                          onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                          className="mt-1"
                        />
                      </div>

                      {/* Marketing Cookies */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">Marketing Cookies</h5>
                          <p className="text-sm text-blue-700">
                            Used to deliver personalized advertisements.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={consent.marketing}
                          onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                          className="mt-1"
                        />
                      </div>

                      {/* Functional Cookies */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">Functional Cookies</h5>
                          <p className="text-sm text-blue-700">
                            Enable enhanced functionality and personalization.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={consent.functional}
                          onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="primary"
                        onClick={saveCustom}
                        className="min-w-[120px]"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowSettings(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Extend window interface for tracking services
declare global {
  interface Window {
    gtag?: any;
    fbq?: any;
  }
} 