import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PerformanceMonitor } from '@/components/tracking/PerformanceMonitor';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://claimconnectors.com'),
  title: {
    default: "Claim Connectors - Get Maximum Compensation for Your Injury | Free Consultation",
    template: "%s | Claim Connectors"
  },
  description: "Injured in an accident? Get connected with top personal injury attorneys. No fees unless we win. Free consultation. Maximum compensation guaranteed.",
  keywords: ["personal injury lawyer", "accident attorney", "car accident lawyer", "injury compensation", "free consultation", "no win no fee"],
  authors: [{ name: "Claim Connectors" }],
  creator: "Claim Connectors",
  publisher: "Claim Connectors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Get Maximum Compensation for Your Injury - Claim Connectors",
    description: "Free consultation with top personal injury attorneys. No fees unless we win your case.",
    url: "https://claimconnectors.com",
    siteName: "Claim Connectors",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Claim Connectors - Personal Injury Law Firm",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Maximum Compensation for Your Injury",
    description: "Free consultation with top personal injury attorneys. No fees unless we win.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://claimconnectors.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Claim Connectors" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        
        {/* DNS Prefetch for additional resources */}
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17097435261"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17097435261');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <PerformanceMonitor />
      </body>
    </html>
  );
}
