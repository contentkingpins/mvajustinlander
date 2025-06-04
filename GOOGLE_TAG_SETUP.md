# Google Tag (gtag.js) Setup Guide

## Overview
This guide helps you set up Google Tag conversion tracking for the MVA landing page. We've prepared the code infrastructure - you just need to complete the Google Ads configuration.

## ✅ What's Already Done

1. **Client-side tracking library** (`src/lib/googleAdsClient.ts`)
   - `trackFormSubmission()` - Tracks form submissions with enhanced data
   - `trackPhoneClick()` - Tracks phone number clicks
   - `trackGoogleAdsConversion()` - Generic conversion tracking

2. **Google Tag component** (`src/components/GoogleTag.tsx`)
   - Ready to be added to your layout/pages
   - Accepts Google Ads ID as prop

## 📋 Manual Steps Required

### Step 1: Create Conversions in Google Ads

1. **Sign in to Google Ads**
2. Navigate to **Tools & Settings** → **Conversions**
3. Click **+ New conversion action**
4. Select **Website**
5. Enter your domain: `claimconnectors.com`
6. Click **Scan**

### Step 2: Create Form Submission Conversion

1. Choose **"Set up conversions manually"** (at the bottom)
2. Click **+ Add a conversion action manually**
3. Configure:
   - **Goal**: Submit lead form
   - **Conversion name**: `Form Submission - MVA`
   - **Value**: $100
   - **Count**: One
   - **Attribution**: Data-driven
4. Click **Done**

### Step 3: Create Phone Click Conversion

1. Add another conversion action
2. Configure:
   - **Goal**: Contact
   - **Conversion name**: `Phone Click - MVA`
   - **Value**: $75
   - **Count**: One
   - **Attribution**: Data-driven
3. Click **Done**

### Step 4: Get Your Tracking Codes

1. Click **Save and continue**
2. Select **"Install the tag yourself"**
3. Note down:
   - **Google Ads ID**: `AW-XXXXXXXXX`
   - **Form Conversion Label**: (e.g., `AbC123dEfGhIjKlM`)
   - **Phone Conversion Label**: (e.g., `XyZ789uVwXyZaBc`)

### Step 5: Update Environment Variables

In AWS Amplify, add these environment variables:
```
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_FORM_CONVERSION_LABEL=AbC123dEfGhIjKlM
NEXT_PUBLIC_PHONE_CONVERSION_LABEL=XyZ789uVwXyZaBc
```

### Step 6: Add Google Tag to Your Site

In your main layout file, add:

```tsx
import GoogleTag from '@/components/GoogleTag';

// In your layout component
<GoogleTag measurementId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID!} />
```

### Step 7: Configure Tracking in Your Forms

In your form component:

```tsx
import { trackFormSubmission } from '@/lib/googleAdsClient';

// In your form submit handler
const handleSubmit = async (data) => {
  // Your existing submission logic
  
  // Track the conversion
  trackFormSubmission({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName
  });
};
```

For phone links:

```tsx
import { trackPhoneClick } from '@/lib/googleAdsClient';

<a 
  href="tel:+1234567890" 
  onClick={trackPhoneClick}
>
  Call Now
</a>
```

### Step 8: Add Configuration Script

Add this to your layout before other scripts:

```html
<script>
  window.__GOOGLE_ADS_CONFIG = {
    googleAdsId: '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}',
    formConversionLabel: '${process.env.NEXT_PUBLIC_FORM_CONVERSION_LABEL}',
    phoneConversionLabel: '${process.env.NEXT_PUBLIC_PHONE_CONVERSION_LABEL}'
  };
</script>
```

## 🧪 Testing Your Setup

1. **Install Google Tag Assistant** (Chrome Extension)
2. **Visit your site** and verify the tag loads
3. **Submit a test form** and check:
   - Browser console for "Google Ads conversion tracked" message
   - Google Tag Assistant shows conversion event
4. **Wait 3 hours** for conversions to appear in Google Ads

## 📊 Viewing Conversions

1. In Google Ads, go to **Campaigns**
2. Click **Segment** → **Conversions** → **Conversion action**
3. You should see your form and phone conversions

## 🔧 Troubleshooting

- **No conversions showing?** Check browser console for errors
- **Tag not firing?** Verify environment variables are set
- **Wrong values?** Double-check conversion labels match exactly

## 📞 Support

For issues with:
- **Code implementation**: Check console logs and environment variables
- **Google Ads setup**: Contact Google Ads support
- **Conversion tracking**: Use Google Tag Assistant for debugging 