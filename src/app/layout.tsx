import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.claimconnectors.com'),
  title: {
    default: 'Claim Connectors - Connect with Top Injury Attorneys',
    template: '%s | Claim Connectors'
  },
  description: 'Connect with top-rated personal injury attorneys. Free consultation, no fees unless we win. Get maximum compensation for your accident case.',
  keywords: ['personal injury lawyer', 'accident attorney', 'car accident lawyer', 'injury compensation', 'free consultation', 'claim connectors'],
  authors: [{ name: 'Claim Connectors' }],
  creator: 'Claim Connectors',
  publisher: 'Claim Connectors',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.claimconnectors.com',
    title: 'Claim Connectors - Connect with Top Injury Attorneys',
    description: 'Connect with top-rated personal injury attorneys. Free consultation, no fees unless we win.',
    siteName: 'Claim Connectors',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Claim Connectors - Personal Injury Attorney Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claim Connectors - Connect with Top Injury Attorneys',
    description: 'Connect with top-rated personal injury attorneys. Free consultation, no fees unless we win.',
    images: ['/images/og-image.jpg'],
    creator: '@claimconnectors',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Google Ads Conversion Tracking */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
