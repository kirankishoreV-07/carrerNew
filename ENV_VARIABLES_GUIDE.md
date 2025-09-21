# Environment Variables Quick Setup

This file contains all the environment variables needed for deployment. 

## For Vercel Deployment

Copy these variables to your Vercel project settings:

### Authentication & Core
```
NEXTAUTH_SECRET=generate-a-random-32-character-string-here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Google AI Services
```
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
```

### Google Cloud Configuration
```
GOOGLE_CLOUD_PROJECT_ID=gen-ai-472417
FIREBASE_PROJECT_ID=gen-ai-472417
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour-firebase-private-key\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=careerai-advisor@gen-ai-472417.iam.gserviceaccount.com
```

### Firebase Client Configuration (Public - Safe for Client)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gen-ai-472417.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-ai-472417
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gen-ai-472417.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Document AI Configuration
```
DOCUMENT_AI_PROCESSOR_ID=your-document-ai-processor-id-from-gcloud
DOCUMENT_AI_LOCATION=us
DOCUMENT_AI_PROJECT_ID=gen-ai-472417
DOCUMENT_AI_PROCESSOR_VERSION=rc
```

### BigQuery Configuration
```
BIGQUERY_DATASET_ID=skills_radar_data
BIGQUERY_TABLE_JOBS=job_market_data
BIGQUERY_TABLE_SKILLS=skills_demand_data
BIGQUERY_TABLE_TRENDS=trend_analysis_data
```

### Optional External APIs (for enhanced features)
```
GOOGLE_CUSTOM_SEARCH_API_KEY=your-custom-search-api-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-custom-search-engine-id
YOUTUBE_DATA_API_KEY=your-youtube-data-api-key
SERPAPI_KEY=your-serpapi-key
NEWSAPI_KEY=your-news-api-key
GITHUB_TOKEN=your-github-token
RAPID_API_KEY=your-rapidapi-key
STACKOVERFLOW_KEY=your-stackoverflow-key
```

---

## For GitHub Actions (Repository Secrets)

Add these secrets to your GitHub repository:

### Google Cloud Deployment
- `GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY`: Content of the service account JSON file
- `NEXTAUTH_SECRET`: Same as above
- `GEMINI_API_KEY`: Same as above
- All Firebase environment variables from above

### Vercel Deployment
- `VERCEL_TOKEN`: Get from Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

---

## How to Get These Values

### 1. Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `gen-ai-472417`
3. Go to Project Settings → General
4. Scroll down to "Your apps" and find the web app config
5. Copy the configuration values

### 3. Firebase Service Account (for server-side)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract `private_key` and `client_email` from the JSON

### 4. Document AI Processor ID
Run this command after setting up Google Cloud:
```bash
gcloud documentai processors list --location=us --format="value(name)"
```

### 5. Vercel Project Information
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → General
4. Find Project ID and Organization ID

---

## Quick Commands

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### Get Document AI Processor ID
```bash
gcloud documentai processors list --location=us --filter="displayName:resume-processor" --format="value(name)" | cut -d'/' -f6
```

### Test Environment Variables
```bash
# Test locally
npm run build

# Test API endpoints
curl http://localhost:3000/api/health
```

---

## Security Notes

- **Never commit sensitive keys** to Git
- **Firebase private key** should have `\n` characters for line breaks when setting in Vercel
- **NEXT_PUBLIC_** variables are exposed to the client-side
- **Regular environment variables** are only available server-side
- **Use Secret Manager** in production for sensitive data

---

## Troubleshooting

### Common Issues:

1. **Build fails**: Check if all required environment variables are set
2. **Firebase errors**: Verify private key format and project ID
3. **Document AI errors**: Ensure processor ID is correct and APIs are enabled
4. **API route errors**: Check service account permissions

### Debug Commands:

```bash
# Check environment variables in Vercel
vercel env ls

# View build logs
vercel logs

# Test local build
npm run build
```
