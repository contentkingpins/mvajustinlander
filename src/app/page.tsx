/**
 * Main landing page for Claim Connectors
 * High-converting personal injury law firm landing page
 */

import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/HeroSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';
import { TrackingProvider } from '@/components/tracking/TrackingProvider';
import { FormProvider } from '@/providers/FormProvider';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ChatWidget } from '@/components/ui/ChatWidget';
import { PhoneButton } from '@/components/ui/PhoneButton';
import { BusinessHoursDetector } from '@/components/tracking/BusinessHoursDetector';

// Lazy load heavy components
const FormModal = dynamic(() => import('@/components/forms/FormModal').then(mod => mod.FormModal));

const NearbyLocations = dynamic(() => import('@/components/sections/NearbyLocations').then(mod => mod.NearbyLocations));

// SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://www.claimconnectors.com'),
  title: 'Injured in an Accident? Get Maximum Compensation | Claim Connectors',
  description: 'Free consultation for accident victims. No fees unless we win. Get the compensation you deserve. Call now for immediate help with your injury claim.',
  keywords: ['personal injury lawyer', 'accident attorney', 'car accident lawyer', 'injury compensation', 'free consultation'],
  openGraph: {
    title: 'Get Maximum Compensation for Your Injuries',
    description: 'Injured? We fight for you. Free consultation, no fees unless we win.',
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Injured in an Accident? We Can Help',
    description: 'Free consultation for accident victims. Get the compensation you deserve.',
  },
  alternates: {
    canonical: 'https://www.claimconnectors.com',
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Claim Connectors Personal Injury Law',
  description: 'Personal injury law firm specializing in accident cases',
  url: 'https://www.claimconnectors.com',
  telephone: process.env.NEXT_PUBLIC_BUSINESS_PHONE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Your City',
    addressRegion: 'Your State',
    addressCountry: 'US',
  },
  priceRange: 'Free Consultation',
  openingHours: 'Mo-Fr 08:00-18:00',
  areaServed: {
    '@type': 'State',
    name: 'Your State',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Legal Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Car Accident Representation',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Personal Injury Claims',
        },
      },
    ],
  },
};

export default function HomePage() {
  return (
    <TrackingProvider>
      <FormProvider>
        <BusinessHoursDetector>
          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          {/* Progress indicator */}
          <ScrollProgress />

          {/* Main content */}
          <main className="min-h-screen bg-white">
            {/* Hero Section with Parallax */}
            <HeroSection />

            {/* Trust Indicators */}
            <section className="bg-gray-50 py-8 border-y border-gray-200">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center gap-8 text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">⭐</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">4.9/5 Rating</p>
                      <p className="text-sm text-gray-600">500+ Reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">💰</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">$500M+</p>
                      <p className="text-sm text-gray-600">Won for Clients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">🏆</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">No Fee</p>
                      <p className="text-sm text-gray-600">Unless We Win</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl">⚡</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">24/7</p>
                      <p className="text-sm text-gray-600">Free Consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Process Section */}
            <ProcessSection />

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Nearby Locations */}
            <NearbyLocations />

            {/* FAQ Section */}
            <FAQSection />

            {/* Final CTA */}
            <CTASection />
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Claim Connectors</h3>
                  <p className="text-gray-400">
                    Fighting for accident victims and their families. No fees unless we win your case.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Practice Areas</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition">Car Accidents</a></li>
                    <li><a href="#" className="hover:text-white transition">Truck Accidents</a></li>
                    <li><a href="#" className="hover:text-white transition">Motorcycle Accidents</a></li>
                    <li><a href="#" className="hover:text-white transition">Slip & Fall</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                    <li><a href="#" className="hover:text-white transition">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition">Case Results</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Contact Us</h4>
                  <p className="text-gray-400 mb-2">
                    <strong>24/7 Free Consultation</strong>
                  </p>
                  <p className="text-2xl font-bold text-blue-400 mb-4">
                    {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
                  </p>
                  <p className="text-gray-400">
                    <a href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`} className="hover:text-white transition">
                      {process.env.NEXT_PUBLIC_BUSINESS_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Claim Connectors. All rights reserved.</p>
                <p className="mt-2">
                  <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
                  {' | '}
                  <a href="/terms" className="hover:text-white transition">Terms of Service</a>
                  {' | '}
                  <a href="/disclaimer" className="hover:text-white transition">Legal Disclaimer</a>
                </p>
                <p className="mt-4 text-xs">
                  The information on this website is for general information purposes only. Nothing on this site should be taken as legal advice.
                </p>
              </div>
            </div>
          </footer>

          {/* Floating Elements */}
          <PhoneButton />
          <ChatWidget />
          <FormModal />
          <CookieConsent />
        </BusinessHoursDetector>
      </FormProvider>
    </TrackingProvider>
  );
}
