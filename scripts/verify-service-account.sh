#!/bin/bash

# 🔧 Google Cloud Service Account Verification Script
# Run this after creating your service account

echo "🔍 Checking Google Cloud Service Account Setup..."
echo "=================================================="

# Check if the service account key file exists
if [ -f "./google-cloud-key.json" ]; then
    echo "✅ Service account key file found: google-cloud-key.json"
    
    # Check file size (should be > 1KB)
    file_size=$(stat -f%z "./google-cloud-key.json" 2>/dev/null || stat -c%s "./google-cloud-key.json" 2>/dev/null)
    if [ "$file_size" -gt 1000 ]; then
        echo "✅ Key file size looks good ($file_size bytes)"
    else
        echo "❌ Key file seems too small. Please re-download."
        exit 1
    fi
    
    # Check if it contains required fields
    if grep -q "private_key" "./google-cloud-key.json" && grep -q "client_email" "./google-cloud-key.json"; then
        echo "✅ Key file contains required credentials"
        
        # Extract project ID from the key file
        project_id=$(grep -o '"project_id": "[^"]*"' "./google-cloud-key.json" | cut -d'"' -f4)
        echo "📍 Project ID: $project_id"
        
        # Extract service account email
        service_email=$(grep -o '"client_email": "[^"]*"' "./google-cloud-key.json" | cut -d'"' -f4)
        echo "📧 Service Account: $service_email"
        
    else
        echo "❌ Key file doesn't contain required credentials"
        exit 1
    fi
else
    echo "❌ Service account key file not found!"
    echo "💡 Please download google-cloud-key.json and place it in this directory"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Get Gemini API key from https://makersuite.google.com/app/apikey"
echo "2. Add all API keys to .env.local file"
echo "3. Run: npm install @google-cloud/aiplatform @google-cloud/bigquery"
echo ""
echo "🚀 Ready to start building the AI features!"
