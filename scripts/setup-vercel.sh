#!/bin/bash

# Vercel Deployment Setup Script for CareerAI Advisor
# This script prepares the project for Vercel deployment

echo "🚀 Setting up Vercel Deployment for CareerAI Advisor"
echo "==================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Project Configuration:"
echo "  • Framework: Next.js 14"
echo "  • Build Command: npm run build"
echo "  • Output Directory: .next"
echo "  • Install Command: npm install"

echo ""
echo "🔑 Environment Variables Setup"
echo "=============================="

# Function to add environment variable to Vercel
add_env_var() {
    local key=$1
    local description=$2
    echo "Adding $key..."
    vercel env add $key production
}

echo ""
echo "Please set up the following environment variables in Vercel:"
echo ""

# Required environment variables for Vercel
env_vars=(
    "NEXTAUTH_SECRET:NextAuth secret key for JWT signing"
    "NEXTAUTH_URL:Full URL of your Vercel deployment"
    "GEMINI_API_KEY:Google Gemini AI API key"
    "GOOGLE_CLOUD_PROJECT_ID:Google Cloud project ID"
    "FIREBASE_PROJECT_ID:Firebase project ID"
    "FIREBASE_PRIVATE_KEY:Firebase service account private key"
    "FIREBASE_CLIENT_EMAIL:Firebase service account email"
    "NEXT_PUBLIC_FIREBASE_API_KEY:Firebase API key (public)"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:Firebase auth domain (public)"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID:Firebase project ID (public)"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:Firebase storage bucket (public)"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:Firebase messaging sender ID (public)"
    "NEXT_PUBLIC_FIREBASE_APP_ID:Firebase app ID (public)"
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:Firebase measurement ID (public)"
    "DOCUMENT_AI_PROCESSOR_ID:Google Document AI processor ID"
    "DOCUMENT_AI_LOCATION:Document AI location (us)"
    "DOCUMENT_AI_PROJECT_ID:Document AI project ID"
    "BIGQUERY_DATASET_ID:BigQuery dataset ID"
    "BIGQUERY_TABLE_JOBS:BigQuery jobs table name"
    "BIGQUERY_TABLE_SKILLS:BigQuery skills table name"
    "BIGQUERY_TABLE_TRENDS:BigQuery trends table name"
    "GOOGLE_CUSTOM_SEARCH_API_KEY:Google Custom Search API key"
    "GOOGLE_CUSTOM_SEARCH_ENGINE_ID:Google Custom Search Engine ID"
    "YOUTUBE_DATA_API_KEY:YouTube Data API key"
    "SERPAPI_KEY:SerpAPI key for Google search results"
)

for env_var in "${env_vars[@]}"; do
    IFS=':' read -r key description <<< "$env_var"
    echo "  $key - $description"
done

echo ""
echo "🌐 Vercel Deployment Commands:"
echo "=============================="
echo ""
echo "1. Login to Vercel:"
echo "   vercel login"
echo ""
echo "2. Link your project:"
echo "   vercel link"
echo ""
echo "3. Set environment variables (you can do this via Vercel dashboard):"
echo "   vercel env add NEXTAUTH_SECRET"
echo "   vercel env add GEMINI_API_KEY"
echo "   # ... and so on for all variables above"
echo ""
echo "4. Deploy to preview:"
echo "   vercel"
echo ""
echo "5. Deploy to production:"
echo "   vercel --prod"
echo ""
echo "🔗 Alternative: Deploy via Vercel Dashboard"
echo "=========================================="
echo "1. Push your code to GitHub"
echo "2. Go to https://vercel.com/dashboard"
echo "3. Click 'Import Project' and select your GitHub repository"
echo "4. Configure environment variables in project settings"
echo "5. Deploy!"
echo ""
echo "📋 Required Files Checklist:"
echo "✅ vercel.json - Vercel configuration"
echo "✅ next.config.js - Next.js configuration optimized for Vercel"
echo "✅ package.json - Dependencies and scripts"
echo ""
echo "🎯 Important Notes:"
echo "• Firebase private key should be added as a single line with \\n for newlines"
echo "• NEXTAUTH_URL should be your full Vercel domain (e.g., https://your-app.vercel.app)"
echo "• All NEXT_PUBLIC_ variables are exposed to the client-side"
echo "• Google Cloud services will work from Vercel with proper service account setup"
echo ""
echo "🚀 Ready for Vercel deployment!"
