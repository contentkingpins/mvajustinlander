# AWS Resources Setup Script for MVA Landing Page (PowerShell)
# This script helps deploy the CloudFormation stack and configure environment variables

Write-Host "MVA Landing Page - AWS Resources Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Configuration
$STACK_NAME = "mva-landing-page-stack"
$TEMPLATE_FILE = "cloudformation-template.yaml"
$REGION = "us-east-1"
$ENVIRONMENT = "production"

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version
    Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: AWS CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
Write-Host "`nChecking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    $AWS_ACCOUNT_ID = $identity.Account
    Write-Host "Using AWS Account: $AWS_ACCOUNT_ID" -ForegroundColor Green
} catch {
    Write-Host "Error: AWS credentials not configured. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Ask for environment
Write-Host ""
$envInput = Read-Host "Enter environment (development/staging/production) [production]"
if ([string]::IsNullOrWhiteSpace($envInput)) {
    $ENVIRONMENT = "production"
} else {
    $ENVIRONMENT = $envInput
}

# Deploy CloudFormation Stack
Write-Host "`nDeploying CloudFormation stack..." -ForegroundColor Yellow
Write-Host "Stack Name: $STACK_NAME-$ENVIRONMENT"
Write-Host "Region: $REGION"

$deployCommand = @"
aws cloudformation deploy `
    --template-file $TEMPLATE_FILE `
    --stack-name "$STACK_NAME-$ENVIRONMENT" `
    --parameter-overrides Environment=$ENVIRONMENT `
    --capabilities CAPABILITY_NAMED_IAM `
    --region $REGION
"@

try {
    Invoke-Expression $deployCommand
    Write-Host "CloudFormation stack deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "CloudFormation deployment failed" -ForegroundColor Red
    exit 1
}

# Get Stack Outputs
Write-Host "`nRetrieving stack outputs..." -ForegroundColor Yellow

$LEADS_TABLE = aws cloudformation describe-stacks `
    --stack-name "$STACK_NAME-$ENVIRONMENT" `
    --query "Stacks[0].Outputs[?OutputKey=='LeadsTableName'].OutputValue" `
    --output text `
    --region $REGION

$ANALYTICS_TABLE = aws cloudformation describe-stacks `
    --stack-name "$STACK_NAME-$ENVIRONMENT" `
    --query "Stacks[0].Outputs[?OutputKey=='AnalyticsTableName'].OutputValue" `
    --output text `
    --region $REGION

$UPLOADS_BUCKET = aws cloudformation describe-stacks `
    --stack-name "$STACK_NAME-$ENVIRONMENT" `
    --query "Stacks[0].Outputs[?OutputKey=='UploadsBucketName'].OutputValue" `
    --output text `
    --region $REGION

$AMPLIFY_ROLE_ARN = aws cloudformation describe-stacks `
    --stack-name "$STACK_NAME-$ENVIRONMENT" `
    --query "Stacks[0].Outputs[?OutputKey=='AmplifyRoleArn'].OutputValue" `
    --output text `
    --region $REGION

# Create .env.local file
Write-Host "`nCreating .env.local file..." -ForegroundColor Yellow

$envContent = @"
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
"@

$envPath = Join-Path -Path ".." -ChildPath ".env.local"
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Host ".env.local file created" -ForegroundColor Green

# Display summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "AWS Resources Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Resources Created:" -ForegroundColor Cyan
Write-Host "  - Leads Table: $LEADS_TABLE"
Write-Host "  - Analytics Table: $ANALYTICS_TABLE"
Write-Host "  - Uploads Bucket: $UPLOADS_BUCKET"
Write-Host "  - Amplify Role: $AMPLIFY_ROLE_ARN"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update the .env.local file with your analytics IDs"
Write-Host "2. Configure these environment variables in AWS Amplify Console:"
Write-Host "   - AWS_REGION=$REGION"
Write-Host "   - DYNAMODB_LEADS_TABLE=$LEADS_TABLE"
Write-Host "   - DYNAMODB_ANALYTICS_TABLE=$ANALYTICS_TABLE"
Write-Host "   - S3_UPLOADS_BUCKET=$UPLOADS_BUCKET"
Write-Host "3. Update the Amplify app's service role to: $AMPLIFY_ROLE_ARN"
Write-Host ""
Write-Host "Important: Don't forget to add these environment variables in AWS Amplify Console!" -ForegroundColor Yellow 