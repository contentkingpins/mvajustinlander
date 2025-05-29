#!/bin/bash

# AWS Resources Setup Script for MVA Landing Page
# This script helps deploy the CloudFormation stack and configure environment variables

set -e

echo "🚀 MVA Landing Page - AWS Resources Setup"
echo "========================================"

# Configuration
STACK_NAME="mva-landing-page-stack"
TEMPLATE_FILE="cloudformation-template.yaml"
REGION="us-east-1"
ENVIRONMENT="production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured. Run 'aws configure' first.${NC}"
    exit 1
fi

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ Using AWS Account: $AWS_ACCOUNT_ID${NC}"

# Ask for environment
echo ""
read -p "Enter environment (development/staging/production) [production]: " ENV_INPUT
ENVIRONMENT=${ENV_INPUT:-production}

# Deploy CloudFormation Stack
echo ""
echo -e "${YELLOW}Deploying CloudFormation stack...${NC}"
echo "Stack Name: $STACK_NAME-$ENVIRONMENT"
echo "Region: $REGION"

aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --parameter-overrides \
        Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CloudFormation stack deployed successfully!${NC}"
else
    echo -e "${RED}✗ CloudFormation deployment failed${NC}"
    exit 1
fi

# Get Stack Outputs
echo ""
echo -e "${YELLOW}Retrieving stack outputs...${NC}"

LEADS_TABLE=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query "Stacks[0].Outputs[?OutputKey=='LeadsTableName'].OutputValue" \
    --output text \
    --region $REGION)

ANALYTICS_TABLE=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query "Stacks[0].Outputs[?OutputKey=='AnalyticsTableName'].OutputValue" \
    --output text \
    --region $REGION)

UPLOADS_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query "Stacks[0].Outputs[?OutputKey=='UploadsBucketName'].OutputValue" \
    --output text \
    --region $REGION)

AMPLIFY_ROLE_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME-$ENVIRONMENT" \
    --query "Stacks[0].Outputs[?OutputKey=='AmplifyRoleArn'].OutputValue" \
    --output text \
    --region $REGION)

# Create .env.local file
echo ""
echo -e "${YELLOW}Creating .env.local file...${NC}"

cat > ../.env.local << EOF
# AWS Configuration
AWS_REGION=$REGION
DYNAMODB_LEADS_TABLE=$LEADS_TABLE
DYNAMODB_ANALYTICS_TABLE=$ANALYTICS_TABLE
S3_UPLOADS_BUCKET=$UPLOADS_BUCKET

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
EOF

echo -e "${GREEN}✓ .env.local file created${NC}"

# Display summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ AWS Resources Setup Complete!${NC}"
echo "========================================"
echo ""
echo "Resources Created:"
echo "  • Leads Table: $LEADS_TABLE"
echo "  • Analytics Table: $ANALYTICS_TABLE"
echo "  • Uploads Bucket: $UPLOADS_BUCKET"
echo "  • Amplify Role: $AMPLIFY_ROLE_ARN"
echo ""
echo "Next Steps:"
echo "1. Update the .env.local file with your analytics IDs"
echo "2. Configure these environment variables in AWS Amplify Console:"
echo "   - AWS_REGION=$REGION"
echo "   - DYNAMODB_LEADS_TABLE=$LEADS_TABLE"
echo "   - DYNAMODB_ANALYTICS_TABLE=$ANALYTICS_TABLE"
echo "   - S3_UPLOADS_BUCKET=$UPLOADS_BUCKET"
echo "3. Update the Amplify app's service role to: $AMPLIFY_ROLE_ARN"
echo ""
echo -e "${YELLOW}⚠️  Important: Don't forget to add these environment variables in AWS Amplify Console!${NC}" 