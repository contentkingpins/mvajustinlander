#!/bin/bash

# AWS Amplify Deployment Preparation Script
# This script helps prepare your project for AWS Amplify deployment

echo "🚀 Preparing Claim Connectors for AWS Amplify deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists git; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites satisfied${NC}"

# Run tests and checks
echo -e "\n${YELLOW}Running pre-deployment checks...${NC}"

echo "1. Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo -e "${RED}Type checking failed. Please fix TypeScript errors.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Type checking passed${NC}"

echo -e "\n2. Linting..."
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}Linting failed. Please fix linting errors.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Linting passed${NC}"

echo -e "\n3. Running tests..."
npm test -- --passWithNoTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Tests failed. Please fix failing tests.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Tests passed${NC}"

echo -e "\n4. Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix build errors.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"

# Check for environment variables file
echo -e "\n${YELLOW}Checking environment setup...${NC}"
if [ ! -f ".env.example" ]; then
    echo -e "${YELLOW}Warning: .env.example file not found${NC}"
fi

# Git status check
echo -e "\n${YELLOW}Checking Git status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}You have uncommitted changes:${NC}"
    git status --short
    echo -e "\n${YELLOW}Consider committing these changes before deployment.${NC}"
fi

# Create deployment checklist
echo -e "\n${GREEN}Pre-deployment checklist:${NC}"
echo "□ Environment variables configured in AWS Amplify Console"
echo "□ Git repository connected to AWS Amplify"
echo "□ Custom domain configured (if applicable)"
echo "□ Email service API keys set up"
echo "□ Analytics tracking IDs configured"
echo "□ Database connection string added (if applicable)"

echo -e "\n${GREEN}✨ Project is ready for AWS Amplify deployment!${NC}"
echo -e "\nNext steps:"
echo "1. Push your code to Git: git push origin main"
echo "2. Follow the deployment guide in docs/AMPLIFY_DEPLOYMENT.md"
echo "3. Configure environment variables in AWS Amplify Console"

# Optional: Show current git remote
if git remote get-url origin >/dev/null 2>&1; then
    echo -e "\nCurrent git remote: $(git remote get-url origin)"
else
    echo -e "\n${YELLOW}No git remote configured. Add one with:${NC}"
    echo "git remote add origin YOUR_REPOSITORY_URL"
fi 