# AWS Amplify Deployment Guide

This guide will walk you through deploying your MVA Justin Lander landing page to AWS Amplify.

## Prerequisites

1. AWS Account
2. GitHub, GitLab, or Bitbucket account
3. Your code pushed to a Git repository

## Step 1: Prepare Your Repository

First, ensure your code is pushed to a Git repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - MVA Justin Lander Landing Page"

# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/mvajustinlander.git

# Push to repository
git push -u origin main
```

## Step 2: AWS Amplify Console Setup

1. **Log into AWS Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "Create new app"

2. **Connect Your Repository**
   - Choose "Host web app"
   - Select your Git provider (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
   - Authorize AWS Amplify to access your repository
   - Select your repository and branch (usually `main` or `master`)

3. **Configure Build Settings**
   - Amplify should auto-detect Next.js and use the `amplify.yml` file
   - If not, ensure the build settings match:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

4. **Configure Environment Variables**
   - Click on "Advanced settings"
   - Add all your environment variables:

   ```
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
   NEXT_PUBLIC_BUSINESS_HOURS_START=08:00
   NEXT_PUBLIC_BUSINESS_HOURS_END=18:00

   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-amplify-app.amplifyapp.com/api
   NEXT_PUBLIC_FORM_SUBMISSION_ENDPOINT=/api/submit-lead
   NEXT_PUBLIC_ANALYTICS_ENDPOINT=/api/analytics

   # Feature Flags
   NEXT_PUBLIC_ENABLE_CHAT=true
   NEXT_PUBLIC_ENABLE_SESSION_RECORDING=true
   NEXT_PUBLIC_ENABLE_AB_TESTING=true

   # Security Keys (Keep these secret!)
   EMAIL_SERVICE_API_KEY=your-email-api-key
   EMAIL_SERVICE_URL=https://api.emailservice.com
   NOTIFICATION_EMAIL=leads@yourfirm.com
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret
   FB_CONVERSIONS_API_TOKEN=your-fb-conversions-token

   # Optional: Database
   DATABASE_URL=your-database-url-if-needed
   ```

5. **Platform Settings**
   - Platform: WEB_COMPUTE
   - Node.js version: 20 (or latest LTS)

## Step 3: Deploy

1. Click "Save and deploy"
2. Wait for the build to complete (usually 5-10 minutes)
3. Once deployed, you'll get a URL like: `https://main.d1234567890abc.amplifyapp.com`

## Step 4: Custom Domain Setup

1. **In Amplify Console:**
   - Go to "Domain management"
   - Click "Add domain"
   - Enter your domain (e.g., `mvajustinlander.com`)

2. **Configure DNS:**
   - Add the provided CNAME records to your DNS provider
   - Wait for SSL certificate provisioning (can take up to 48 hours)

3. **Add www redirect:**
   - Set up `www.mvajustinlander.com` to redirect to `mvajustinlander.com`

## Step 5: Post-Deployment Configuration

### Enable Server-Side Rendering (SSR)
Amplify automatically detects and configures SSR for Next.js apps.

### Set up Continuous Deployment
- Every push to your main branch will trigger a new deployment
- Create separate branches for staging/development

### Configure Build Notifications
1. Go to "Notifications" in Amplify Console
2. Set up email notifications for build status

## Performance Optimization

### Enable Amplify Performance Mode
```yaml
# In amplify.yml, add:
performance:
  mode: true
```

### Configure Caching Headers
Already configured in `next.config.ts` with security headers.

### Image Optimization
- Use Amplify's built-in image optimization
- Or integrate with CloudFront for CDN delivery

## Monitoring and Analytics

1. **CloudWatch Integration**
   - Automatically enabled for error tracking
   - View logs in CloudWatch console

2. **Set up Alarms**
   - 4XX/5XX error rates
   - Build failures
   - Performance degradation

## Troubleshooting

### Build Failures
1. Check build logs in Amplify Console
2. Common issues:
   - Missing environment variables
   - Node version mismatch
   - Memory limits (increase if needed)

### Performance Issues
1. Enable Amplify Performance Monitoring
2. Check Core Web Vitals in Amplify Console
3. Use CloudFront for static assets

### Environment Variables Not Working
1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding new variables
3. Check variable names for typos

## Cost Optimization

1. **Free Tier:**
   - 1000 build minutes per month
   - 15 GB served per month
   - 5 GB stored per month

2. **Cost Saving Tips:**
   - Use build caching
   - Optimize images
   - Enable compression
   - Set appropriate cache headers

## Security Best Practices

1. **Never commit sensitive data**
   - Use environment variables for all secrets
   - Keep `.env.local` in `.gitignore`

2. **Enable Web Application Firewall (WAF)**
   - Protect against common attacks
   - Set up rate limiting

3. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

## Backup and Disaster Recovery

1. **Automatic Backups**
   - Amplify keeps build artifacts
   - Use Git for code versioning

2. **Manual Backups**
   - Export environment variables
   - Document custom configurations

## Advanced Features

### A/B Testing with Amplify
```javascript
// Use feature flags in your code
const variant = process.env.NEXT_PUBLIC_AB_TEST_VARIANT || 'control';
```

### Edge Functions
- Deploy API routes at edge locations
- Reduce latency for global users

### Integration with Other AWS Services
- S3 for file uploads
- SES for email sending
- DynamoDB for data storage
- Lambda for serverless functions

## Support and Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js on AWS Amplify Guide](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-nextjs.html)
- [AWS Support](https://aws.amazon.com/support/)

## Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Security headers verified
- [ ] SEO meta tags working
- [ ] Analytics tracking verified
- [ ] Form submissions working
- [ ] Mobile responsiveness tested

---

For additional help, contact AWS Support or refer to the Amplify Community forums. 