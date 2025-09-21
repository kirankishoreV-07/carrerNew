# 🚀 Google Cloud Document AI Setup Guide

## Overview
This guide helps you set up Google Cloud Document AI for the Resume Scoring feature. Document AI provides superior PDF text extraction compared to basic parsing libraries.

## Prerequisites
- Google Cloud Project with billing enabled
- Google Cloud CLI installed (optional but recommended)

## Step-by-Step Setup

### 1. Enable Document AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `gen-ai-472417`
3. Navigate to **APIs & Services > Library**
4. Search for "Document AI API"
5. Click on "Cloud Document AI API" and click **ENABLE**

### 2. Create a Document AI Processor

1. Go to [Document AI Console](https://console.cloud.google.com/ai/document-ai/processors)
2. Click **CREATE PROCESSOR**
3. Select **Document OCR** (for general document processing)
4. Choose processor name: `resume-processor`
5. Select region: **US** (recommended)
6. Click **CREATE**
7. **Copy the Processor ID** - you'll need this for the .env file

### 3. Set Up Service Account (if not already done)

1. Go to **IAM & Admin > Service Accounts**
2. Click **CREATE SERVICE ACCOUNT**
3. Name: `resume-scoring-service`
4. Grant role: **Document AI API User**
5. Click **CREATE AND CONTINUE**
6. Click **DONE**
7. Click on the created service account
8. Go to **KEYS** tab
9. Click **ADD KEY > Create new key**
10. Select **JSON** format
11. Download the key file and save it as `google-cloud-key.json` in your project root

### 4. Update Environment Variables

Add these to your `.env.local` file:

```bash
# Document AI Configuration
DOCUMENT_AI_PROJECT_ID=gen-ai-472417
DOCUMENT_AI_PROCESSOR_ID=your-processor-id-here
DOCUMENT_AI_LOCATION=us
DOCUMENT_AI_PROCESSOR_VERSION=rc
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
```

Replace `your-processor-id-here` with the actual processor ID from step 2.

### 5. Verify Setup

1. Restart your development server
2. Try uploading a resume PDF
3. Check the console logs - you should see:
   ```
   🔍 Processing document with Google Document AI...
   ✅ Document processed successfully with Document AI
   ```

## Alternative: Use Basic PDF Parser (Current Fallback)

If you don't want to set up Document AI right now, the system will automatically fall back to using the `pdf-parse` library, which works well for most resumes but may have lower accuracy for complex layouts.

## Troubleshooting

### "Permission denied: Consumer 'projects/undefined'"
- Check that `DOCUMENT_AI_PROJECT_ID` is set correctly in `.env.local`
- Verify the service account key file exists and path is correct

### "Processor not found"
- Verify the `DOCUMENT_AI_PROCESSOR_ID` matches the one from the console
- Ensure the processor is in the same region as specified in `DOCUMENT_AI_LOCATION`

### "Authentication error"
- Check that `GOOGLE_APPLICATION_CREDENTIALS` points to the correct JSON key file
- Verify the service account has "Document AI API User" role

## Cost Information

Document AI pricing (as of 2024):
- First 1,000 pages per month: **FREE**
- Additional pages: ~$1.50 per 1,000 pages

For a resume scoring application, this is very cost-effective!

## Need Help?

If you encounter any issues:
1. Check the console logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the service account JSON file is in the correct location
4. The system will fall back to basic PDF parsing if Document AI fails