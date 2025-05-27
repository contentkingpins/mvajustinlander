# Claim Connectors - High-Converting Personal Injury Landing Page

A modern, high-converting landing page for personal injury law firms built with Next.js 15, TypeScript, and Tailwind CSS. Features advanced tracking, conversion optimization, and AWS Amplify deployment.

## 🚀 Features

### Core Functionality
- **Custom Tracking System** - Works with ad blockers using first-party analytics
- **Multi-Step Form** - Smart form with state persistence and field tracking
- **Business Hours Detection** - Dynamic CTAs based on office hours
- **Geolocation** - "Near me" functionality for local targeting
- **A/B Testing Ready** - Built-in support for conversion optimization

### Performance & SEO
- **Core Web Vitals Optimized** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- **SEO Optimized** - Schema markup, meta tags, sitemap
- **Mobile First** - Fully responsive design
- **Progressive Enhancement** - Works without JavaScript

### Compliance
- **GDPR/CCPA Compliant** - Cookie consent management
- **WCAG 2.1 AA** - Accessibility standards
- **ADA Compliant** - Accessible forms and navigation
- **Legal Disclaimers** - Properly displayed

### Tracking & Analytics
- Google Analytics 4
- Facebook Pixel
- Google Tag Manager
- Microsoft Clarity
- Hotjar
- First-party fallback tracking

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: React Context
- **Testing**: Jest + React Testing Library
- **Analytics**: Custom tracking hook with multi-platform support

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/claimconnectors.git
cd claimconnectors
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Analytics & Tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id
NEXT_PUBLIC_FB_PIXEL_ID=your-fb-pixel-id
NEXT_PUBLIC_GTM_ID=your-gtm-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
NEXT_PUBLIC_CLARITY_ID=your-clarity-id

# Business Configuration
NEXT_PUBLIC_BUSINESS_PHONE=1-800-YOUR-FIRM
NEXT_PUBLIC_BUSINESS_EMAIL=contact@yourfirm.com
NEXT_PUBLIC_BUSINESS_TIMEZONE=America/New_York

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api.com
EMAIL_SERVICE_API_KEY=your-email-api-key
NOTIFICATION_EMAIL=leads@yourfirm.com
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t claimconnectors .
docker run -p 3000:3000 claimconnectors
```

### Traditional Hosting
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── analytics/     # First-party analytics endpoint
│   │   └── submit-lead/   # Form submission endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── forms/            # Form components
│   ├── sections/         # Page sections
│   ├── tracking/         # Tracking components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
│   └── useTracking.ts    # Main tracking hook
├── providers/            # Context providers
│   └── FormProvider.tsx  # Form state management
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── constants/            # App constants
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## 📊 Performance Optimization

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Serve WebP format
- Use proper sizing

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Lazy load below-the-fold content

### Caching Strategy
- Static assets: 1 year
- HTML: revalidate on deploy
- API responses: 5 minutes

## 🔧 Customization

### Adding New Sections
1. Create component in `src/components/sections/`
2. Import in `src/app/page.tsx`
3. Add tracking events
4. Test responsiveness

### Modifying Forms
1. Update types in `src/types/index.ts`
2. Modify validation in `FormProvider`
3. Update API endpoint
4. Test form flow

### Changing Styles
1. Modify Tailwind config
2. Update component classes
3. Ensure accessibility
4. Test dark mode (if implemented)

## 🔒 Security

- All form inputs are validated
- XSS protection enabled
- CSRF protection on API routes
- Rate limiting implemented
- SQL injection prevention

## 📈 Analytics Implementation

The custom tracking system captures:
- Page views
- Scroll depth
- Form interactions
- Conversion events
- Session duration
- UTM parameters
- Device/browser info

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚨 Important Notes

1. **Legal Compliance**: Ensure all content complies with your jurisdiction's legal advertising rules
2. **Privacy Policy**: Update privacy policy to reflect your data collection practices
3. **Terms of Service**: Include proper terms of service
4. **Disclaimers**: Add appropriate legal disclaimers

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**TypeScript Errors**
```bash
npm run type-check
```

**Linting Issues**
```bash
npm run lint -- --fix
```

## 📞 Support

For support, email support@yourfirm.com or join our Slack channel.

---

Built with ❤️ for maximum conversions
