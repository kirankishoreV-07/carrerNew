#!/bin/bash

# Firebase Environment Setup Script
# This script helps set up environment variables for different deployment platforms

echo "🔥 Firebase Environment Variables Setup"
echo "======================================"

# Read the current .env.local if it exists
if [ -f ".env.local" ]; then
    echo "✅ Found .env.local file"
    source .env.local
else
    echo "❌ .env.local file not found. Please create it first."
    exit 1
fi

# Function to display environment variables
display_env_vars() {
    echo ""
    echo "Current Firebase Configuration:"
    echo "NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
}

# Function to generate Vercel deployment command
generate_vercel_command() {
    echo ""
    echo "🚀 Vercel Deployment Command:"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
}

# Function to generate Netlify environment variables
generate_netlify_vars() {
    echo ""
    echo "🌐 Netlify Environment Variables:"
    echo "Add these in your Netlify dashboard (Site settings > Environment variables):"
    echo ""
    echo "NEXT_PUBLIC_FIREBASE_API_KEY = $NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID = $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = $NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = $NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "NEXT_PUBLIC_FIREBASE_APP_ID = $NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = $NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
}

# Function to generate Docker environment file
generate_docker_env() {
    echo ""
    echo "🐳 Docker Environment File (.env.production):"
    cat > .env.production << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
EOF
    echo "✅ Created .env.production file"
}

# Menu
echo ""
echo "What would you like to do?"
echo "1) Display current environment variables"
echo "2) Generate Vercel deployment commands"
echo "3) Generate Netlify environment variables"
echo "4) Generate Docker environment file"
echo "5) All of the above"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1) display_env_vars ;;
    2) generate_vercel_command ;;
    3) generate_netlify_vars ;;
    4) generate_docker_env ;;
    5) 
        display_env_vars
        generate_vercel_command
        generate_netlify_vars
        generate_docker_env
        ;;
    *) echo "Invalid choice" ;;
esac

echo ""
echo "🎉 Setup complete!"
