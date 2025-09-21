# 🚀 CareerAI Advisor - Complete Deployment Guide

## Architecture Overview

This application uses a **hybrid deployment architecture**:
- **Frontend**: Deployed on Vercel for optimal performance and global CDN
- **Backend APIs**: Next.js API routes (serverless functions) on Vercel
- **Google Cloud Services**: Document AI, BigQuery, Vertex AI, Firebase

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **Vercel Account** (free tier available)
3. **GitHub Account** for CI/CD
4. **Required API Keys**:
   - Google Gemini AI API key
   - Firebase configuration
   - Google Cloud service account
   - YouTube Data API key (optional)
   - Custom Search API key (optional)

## 🔧 Step 1: Google Cloud Setup

### 1.1 Run the Google Cloud Setup Script

```bash
# Make the script executable
chmod +x scripts/setup-google-cloud.sh

# Run the setup script
./scripts/setup-google-cloud.sh
```

This script will:
- ✅ Enable required Google Cloud APIs
- ✅ Create App Engine application
- ✅ Set up Document AI processor
- ✅ Create BigQuery dataset and tables
- ✅ Configure service account with proper permissions
- ✅ Set up Cloud Storage bucket
- ✅ Create Secret Manager secrets

### 1.2 Manual Steps After Script

1. **Get your Document AI Processor ID**:
   ```bash
   gcloud documentai processors list --location=us
   ```

2. **Update Secret Manager with actual values**:
   ```bash
   # Add your actual Gemini API key
   echo "your-actual-gemini-api-key" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
   
   # Add NextAuth secret
   echo "your-nextauth-secret-32-chars-min" | gcloud secrets versions add NEXTAUTH_SECRET --data-file=-
   
   # Add Firebase private key
   echo "-----BEGIN PRIVATE KEY-----\nyour-firebase-private-key\n-----END PRIVATE KEY-----" | gcloud secrets versions add FIREBASE_PRIVATE_KEY --data-file=-
   ```

3. **Download Service Account Key**:
   ```bash
   gcloud iam service-accounts keys create google-cloud-service-account.json \
     --iam-account=careerai-advisor@gen-ai-472417.iam.gserviceaccount.com
   ```

## 🌐 Step 2: Vercel Deployment

### 2.1 Prepare for Vercel

```bash
# Run the Vercel setup script
chmod +x scripts/setup-vercel.sh
./scripts/setup-vercel.sh
```

### 2.2 Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option B: Via GitHub (Recommended)**
1. Push your code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables (see below)
6. Deploy!

### 2.3 Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```env
# Authentication
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=https://your-app-name.vercel.app

# Google AI
GEMINI_API_KEY=your-gemini-api-key

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=gen-ai-472417
FIREBASE_PROJECT_ID=gen-ai-472417
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour-firebase-private-key\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=careerai-advisor@gen-ai-472417.iam.gserviceaccount.com

# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gen-ai-472417.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-ai-472417
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gen-ai-472417.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Document AI
DOCUMENT_AI_PROCESSOR_ID=your-processor-id-from-gcloud
DOCUMENT_AI_LOCATION=us
DOCUMENT_AI_PROJECT_ID=gen-ai-472417

# BigQuery
BIGQUERY_DATASET_ID=skills_radar_data
BIGQUERY_TABLE_JOBS=job_market_data
BIGQUERY_TABLE_SKILLS=skills_demand_data
BIGQUERY_TABLE_TRENDS=trend_analysis_data

# Optional External APIs
GOOGLE_CUSTOM_SEARCH_API_KEY=your-custom-search-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-search-engine-id
YOUTUBE_DATA_API_KEY=your-youtube-api-key
SERPAPI_KEY=your-serpapi-key
```

## 🔄 Step 3: CI/CD Setup

### 3.1 GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

**For Google Cloud Deployment:**
- `GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY`: Content of `google-cloud-service-account.json`
- `NEXTAUTH_SECRET`: Your NextAuth secret
- `GEMINI_API_KEY`: Your Gemini API key
- All Firebase environment variables

**For Vercel Deployment:**
- `VERCEL_TOKEN`: Your Vercel token (from Vercel Dashboard → Settings → Tokens)
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### 3.2 Automatic Deployments

The CI/CD pipeline is configured to:
- ✅ Run tests and linting on every PR
- ✅ Deploy to Vercel preview on PR
- ✅ Deploy to Vercel production on main branch push
- ✅ Deploy to Google Cloud App Engine on main branch push

## 🧪 Step 4: Testing Deployment

### 4.1 Local Testing

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Run development server
npm run dev

# Test build
npm run build
npm start
```

### 4.2 Feature Testing Checklist

After deployment, test these features:

- [ ] **Authentication**: User login/logout with Firebase
- [ ] **Resume Upload**: PDF upload and processing with Document AI
- [ ] **Resume Scoring**: AI-powered resume analysis
- [ ] **Skills Radar**: Skills prediction and visualization
- [ ] **Career Simulator**: Career path simulation
- [ ] **Data Persistence**: Firebase Firestore operations
- [ ] **File Storage**: Cloud Storage file uploads

### 4.3 API Endpoints Testing

Test these API endpoints:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Skills radar (POST with user data)
curl -X POST https://your-app.vercel.app/api/skills-radar \
  -H "Content-Type: application/json" \
  -d '{"currentSkills":["JavaScript","React"],"targetRole":"Full Stack Developer"}'

# Career simulator (POST with profile data)
curl -X POST https://your-app.vercel.app/api/career-simulator \
  -H "Content-Type: application/json" \
  -d '{"skills":["JavaScript"],"interests":["Web Dev"],"experience":"Fresher"}'
```

## 🔍 Step 5: Monitoring and Debugging

### 5.1 Vercel Monitoring

- **Logs**: Vercel Dashboard → Functions → View logs
- **Analytics**: Vercel Dashboard → Analytics
- **Performance**: Vercel Dashboard → Speed Insights

### 5.2 Google Cloud Monitoring

```bash
# View App Engine logs
gcloud app logs tail -s default

# View BigQuery jobs
bq ls -j

# Check Document AI usage
gcloud logging read "resource.type=documentai_api"
```

### 5.3 Common Issues & Solutions

**Build Failures:**
- Check TypeScript errors: `npx tsc --noEmit`
- Verify environment variables are set
- Check dependencies in package.json

**API Route Errors:**
- Verify Google Cloud service account permissions
- Check environment variables in Vercel dashboard
- Review function logs in Vercel dashboard

**Firebase Connection Issues:**
- Verify Firebase configuration in environment variables
- Check Firebase project permissions
- Ensure Firebase APIs are enabled

## 🎯 Step 6: Production Optimization

### 6.1 Performance Optimization

- **Images**: Already configured for Next.js optimization
- **Caching**: API routes include appropriate cache headers
- **Compression**: Enabled in next.config.js
- **Bundle Analysis**: Run `npm run build` to see bundle size

### 6.2 Security Best Practices

- ✅ Environment variables properly secured
- ✅ Firebase security rules configured
- ✅ CORS headers configured
- ✅ Service account permissions minimal

### 6.3 Cost Optimization

- **Vercel**: Free tier includes generous limits
- **Google Cloud**: Monitor usage in Cloud Console
- **Firebase**: Set up budget alerts
- **APIs**: Monitor API usage and quotas

## 🚀 Deployment URLs

After successful deployment:

- **Frontend (Vercel)**: `https://your-app-name.vercel.app`
- **Backend APIs**: Same as frontend (serverless functions)
- **Google Cloud Console**: https://console.cloud.google.com/appengine?project=gen-ai-472417

## 📞 Support

If you encounter issues:

1. Check the logs in Vercel dashboard
2. Review Google Cloud logs
3. Verify all environment variables are set correctly
4. Test API endpoints individually
5. Check GitHub Actions for CI/CD issues

---

**🎉 Congratulations! Your CareerAI Advisor is now deployed and ready to help users with their career journey!**
