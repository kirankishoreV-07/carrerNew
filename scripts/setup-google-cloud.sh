#!/bin/bash

# Google Cloud Services Setup Script for CareerAI Advisor
# This script sets up all required Google Cloud services

set -e

PROJECT_ID="gen-ai-472417"
REGION="us-central1"
LOCATION="us"

echo "🚀 Setting up Google Cloud Services for CareerAI Advisor"
echo "======================================================="

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "🔐 Setting project and region..."
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION

echo ""
echo "🎯 Enabling required APIs..."

# Enable all required APIs
apis=(
    "appengine.googleapis.com"
    "cloudbuild.googleapis.com"
    "documentai.googleapis.com"
    "aiplatform.googleapis.com"
    "bigquery.googleapis.com"
    "storage.googleapis.com"
    "firebase.googleapis.com"
    "firestore.googleapis.com"
    "translate.googleapis.com"
    "customsearch.googleapis.com"
    "youtube.googleapis.com"
    "secretmanager.googleapis.com"
)

for api in "${apis[@]}"; do
    echo "  Enabling $api..."
    gcloud services enable $api --quiet
done

echo ""
echo "🔧 Creating App Engine application..."
if ! gcloud app describe --quiet > /dev/null 2>&1; then
    gcloud app create --region=$REGION --quiet
    echo "✅ App Engine application created"
else
    echo "✅ App Engine application already exists"
fi

echo ""
echo "📄 Setting up Document AI processor..."

# Check if Document AI processor exists
processor_name="resume-processor"
if ! gcloud documentai processors list --location=$LOCATION --filter="displayName:$processor_name" --format="value(name)" | grep -q .; then
    echo "  Creating Document AI processor..."
    gcloud documentai processors create \
        --location=$LOCATION \
        --display-name=$processor_name \
        --type=OCR_PROCESSOR \
        --quiet
    echo "✅ Document AI processor created"
else
    echo "✅ Document AI processor already exists"
fi

# Get processor ID
PROCESSOR_ID=$(gcloud documentai processors list --location=$LOCATION --filter="displayName:$processor_name" --format="value(name)" | cut -d'/' -f6)
echo "📋 Document AI Processor ID: $PROCESSOR_ID"

echo ""
echo "🗄️ Setting up BigQuery dataset..."

# Create BigQuery dataset
dataset_name="skills_radar_data"
if ! bq show --dataset $PROJECT_ID:$dataset_name > /dev/null 2>&1; then
    bq mk --dataset \
        --location=$REGION \
        --description="CareerAI Advisor skills and job market data" \
        $PROJECT_ID:$dataset_name
    echo "✅ BigQuery dataset created"
else
    echo "✅ BigQuery dataset already exists"
fi

# Create tables
echo "  Creating BigQuery tables..."

# Job market data table
bq mk --table \
    --description="Job market trends and salary data" \
    $PROJECT_ID:$dataset_name.job_market_data \
    role:STRING,skills:STRING,salary_min:INTEGER,salary_max:INTEGER,location:STRING,industry:STRING,posted_date:TIMESTAMP,source:STRING > /dev/null 2>&1 || echo "    job_market_data table exists"

# Skills demand data table
bq mk --table \
    --description="Skills demand and trending technologies" \
    $PROJECT_ID:$dataset_name.skills_demand_data \
    skill:STRING,demand_score:FLOAT,trend_direction:STRING,industry:STRING,region:STRING,last_updated:TIMESTAMP > /dev/null 2>&1 || echo "    skills_demand_data table exists"

# Trend analysis data table
bq mk --table \
    --description="Market trend analysis and predictions" \
    $PROJECT_ID:$dataset_name.trend_analysis_data \
    technology:STRING,adoption_rate:FLOAT,market_share:FLOAT,growth_rate:FLOAT,prediction_date:TIMESTAMP,data_source:STRING > /dev/null 2>&1 || echo "    trend_analysis_data table exists"

echo "✅ BigQuery tables created/verified"

echo ""
echo "🔐 Setting up service account..."

# Create service account
SERVICE_ACCOUNT="careerai-advisor"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL --quiet > /dev/null 2>&1; then
    gcloud iam service-accounts create $SERVICE_ACCOUNT \
        --display-name="CareerAI Advisor Service Account" \
        --description="Service account for CareerAI Advisor application" \
        --quiet
    echo "✅ Service account created"
else
    echo "✅ Service account already exists"
fi

# Assign roles
roles=(
    "roles/documentai.editor"
    "roles/aiplatform.user"
    "roles/bigquery.dataEditor"
    "roles/bigquery.jobUser"
    "roles/storage.objectViewer"
    "roles/firebase.admin"
    "roles/cloudsql.client"
    "roles/secretmanager.secretAccessor"
)

echo "  Assigning roles..."
for role in "${roles[@]}"; do
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
        --role="$role" \
        --quiet > /dev/null
done

echo "✅ Service account roles assigned"

echo ""
echo "🔑 Creating service account key..."
KEY_FILE="google-cloud-service-account.json"
if [ ! -f "$KEY_FILE" ]; then
    gcloud iam service-accounts keys create $KEY_FILE \
        --iam-account=$SERVICE_ACCOUNT_EMAIL \
        --quiet
    echo "✅ Service account key created: $KEY_FILE"
else
    echo "✅ Service account key already exists: $KEY_FILE"
fi

echo ""
echo "🔒 Setting up Secret Manager for sensitive environment variables..."

# Create secrets for sensitive data
secrets=(
    "GEMINI_API_KEY"
    "NEXTAUTH_SECRET"
    "FIREBASE_PRIVATE_KEY"
    "FIREBASE_CLIENT_EMAIL"
    "GOOGLE_CUSTOM_SEARCH_API_KEY"
    "GOOGLE_CUSTOM_SEARCH_ENGINE_ID"
    "YOUTUBE_DATA_API_KEY"
    "SERPAPI_KEY"
)

for secret in "${secrets[@]}"; do
    if ! gcloud secrets describe $secret --quiet > /dev/null 2>&1; then
        echo "  Creating secret: $secret"
        echo "placeholder-value" | gcloud secrets create $secret \
            --data-file=- \
            --quiet
        echo "    ⚠️  Remember to update the actual value for $secret"
    else
        echo "✅ Secret $secret already exists"
    fi
done

echo ""
echo "🌍 Setting up Cloud Storage bucket for file uploads..."
BUCKET_NAME="$PROJECT_ID-careerai-uploads"
if ! gsutil ls -b gs://$BUCKET_NAME > /dev/null 2>&1; then
    gsutil mb -l $REGION gs://$BUCKET_NAME
    echo "✅ Cloud Storage bucket created: $BUCKET_NAME"
else
    echo "✅ Cloud Storage bucket already exists: $BUCKET_NAME"
fi

# Set bucket permissions
gsutil iam ch serviceAccount:$SERVICE_ACCOUNT_EMAIL:objectAdmin gs://$BUCKET_NAME

echo ""
echo "🎉 Google Cloud Services Setup Complete!"
echo "========================================"
echo ""
echo "📋 Summary:"
echo "  • Project ID: $PROJECT_ID"
echo "  • Region: $REGION"
echo "  • App Engine: ✅ Ready"
echo "  • Document AI Processor ID: $PROCESSOR_ID"
echo "  • BigQuery Dataset: $dataset_name"
echo "  • Service Account: $SERVICE_ACCOUNT_EMAIL"
echo "  • Storage Bucket: $BUCKET_NAME"
echo ""
echo "🔑 Next Steps:"
echo "1. Update Secret Manager secrets with actual values:"
echo "   gcloud secrets versions add GEMINI_API_KEY --data-file=<path-to-api-key-file>"
echo ""
echo "2. Add these environment variables to your app.yaml or Vercel:"
echo "   DOCUMENT_AI_PROCESSOR_ID=$PROCESSOR_ID"
echo "   GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID"
echo "   BIGQUERY_DATASET_ID=$dataset_name"
echo ""
echo "3. Deploy your application:"
echo "   gcloud app deploy"
echo ""
echo "🚀 Ready to deploy!"
