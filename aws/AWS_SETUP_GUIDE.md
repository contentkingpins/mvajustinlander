# AWS Backend Setup Guide for MVA Landing Page

## 🎯 Overview

This guide will help you set up the AWS backend services for your MVA Landing Page, including:
- **DynamoDB** for storing leads and analytics data
- **S3** for file uploads (future use)
- **CloudWatch** for monitoring and alerts
- **IAM roles** for secure access

## 📋 Prerequisites

1. **AWS Account** - [Create one here](https://aws.amazon.com/free/)
2. **AWS CLI** - [Installation guide](https://aws.amazon.com/cli/)
3. **AWS Credentials configured** - Run `aws configure`

## 🚀 Quick Setup (Automated)

### For Windows (PowerShell):
```powershell
cd aws
.\setup-aws-resources.ps1
```

### For Mac/Linux:
```bash
cd aws
chmod +x setup-aws-resources.sh
./setup-aws-resources.sh
```

## 📝 Manual Setup Steps

If you prefer to set up manually or the automated script fails:

### Step 1: Deploy CloudFormation Stack

1. **Log into AWS Console**
2. Navigate to **CloudFormation**
3. Click **Create Stack** → **With new resources**
4. Choose **Upload a template file**
5. Upload `aws/cloudformation-template.yaml`
6. Stack name: `mva-landing-page-stack-production`
7. Parameters:
   - ProjectName: `mva-landing-page`
   - Environment: `production`
8. Check **I acknowledge that AWS CloudFormation might create IAM resources**
9. Click **Create stack**

### Step 2: Configure Environment Variables

After the stack is created, get the outputs:

1. Go to the **Outputs** tab of your CloudFormation stack
2. Note down these values:
   - `LeadsTableName`
   - `AnalyticsTableName`
   - `UploadsBucketName`
   - `AmplifyRoleArn`

3. Create `.env.local` file in your project root:
```env
# AWS Configuration
AWS_REGION=us-east-1
DYNAMODB_LEADS_TABLE=mva-landing-page-leads-production
DYNAMODB_ANALYTICS_TABLE=mva-landing-page-analytics-production
S3_UPLOADS_BUCKET=mva-landing-page-uploads-production-[YOUR-ACCOUNT-ID]

# Analytics & Tracking (Add your IDs here)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_HOTJAR_ID=
NEXT_PUBLIC_CLARITY_ID=

# Business Configuration
NEXT_PUBLIC_PHONE_NUMBER=1-800-LAWYERS
NEXT_PUBLIC_BUSINESS_NAME=MVA Legal Services
NEXT_PUBLIC_BUSINESS_TIMEZONE=America/New_York

# API Configuration
NEXT_PUBLIC_API_URL=/api
```

### Step 3: Configure AWS Amplify

1. **Go to AWS Amplify Console**
2. Select your app
3. Go to **App settings** → **Environment variables**
4. Add these variables:
   ```
   AWS_REGION=us-east-1
   DYNAMODB_LEADS_TABLE=[Your Leads Table Name]
   DYNAMODB_ANALYTICS_TABLE=[Your Analytics Table Name]
   S3_UPLOADS_BUCKET=[Your S3 Bucket Name]
   ```

5. **Update Service Role**:
   - Go to **App settings** → **General**
   - Click **Edit**
   - Change the service role to the one created by CloudFormation
   - Save

### Step 4: Redeploy Your App

Trigger a new deployment in Amplify to use the new environment variables:

```bash
git add .
git commit -m "Configure AWS backend services"
git push origin main
```

## 🧪 Testing the Setup

### Test Lead Submission:
```bash
curl -X POST https://your-domain.com/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "555-123-4567",
    "accidentType": "car_accident",
    "accidentDate": "2024-01-01",
    "injuryDescription": "Test injury description",
    "medicalTreatment": true,
    "propertyDamage": false,
    "state": "NY",
    "city": "New York",
    "zipCode": "10001",
    "hasAttorney": false,
    "policeReport": true,
    "insuranceClaim": false,
    "consent": true
  }'
```

### Test Analytics:
```bash
curl -X POST https://your-domain.com/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "category": "form",
    "action": "test_event",
    "timestamp": 1234567890,
    "sessionId": "test-session-123"
  }'
```

## 📊 Monitoring

### View Leads in DynamoDB:
1. Go to **DynamoDB** in AWS Console
2. Select your leads table
3. Click **Explore table items**

### View Analytics:
1. Go to **DynamoDB** in AWS Console
2. Select your analytics table
3. Click **Explore table items**

### CloudWatch Metrics:
1. Go to **CloudWatch** → **Metrics**
2. Select **DynamoDB**
3. View metrics for your tables

## 🔒 Security Best Practices

1. **Never commit `.env.local` to git**
2. **Use IAM roles** instead of access keys when possible
3. **Enable CloudTrail** for audit logging
4. **Set up budget alerts** to monitor costs
5. **Enable MFA** on your AWS account

## 💰 Cost Estimation

With DynamoDB on-demand pricing:
- **Leads storage**: ~$0.25 per million write requests
- **Analytics storage**: ~$0.25 per million write requests
- **S3 storage**: ~$0.023 per GB per month
- **CloudWatch**: Free tier covers basic monitoring

Estimated monthly cost for moderate traffic: **$5-20**

## 🆘 Troubleshooting

### "Access Denied" errors:
- Check that Amplify is using the correct service role
- Verify environment variables are set correctly

### "Table not found" errors:
- Ensure CloudFormation stack deployed successfully
- Check table names in environment variables match actual table names

### Lead submissions not saving:
- Check CloudWatch logs for errors
- Verify DynamoDB tables exist and are accessible

## 📚 Additional Resources

- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [AWS Amplify Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)

## ✅ Checklist

- [ ] AWS CLI installed and configured
- [ ] CloudFormation stack deployed
- [ ] Environment variables created locally
- [ ] Environment variables added to Amplify Console
- [ ] Service role updated in Amplify
- [ ] App redeployed with new configuration
- [ ] Lead submission tested
- [ ] Analytics tracking tested
- [ ] CloudWatch monitoring verified

---

**Need help?** Check the CloudWatch logs or open an issue in the repository. 