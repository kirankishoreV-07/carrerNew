#!/bin/bash

# GitHub Push Script for CareerAI Advisor
echo "🚀 Pushing CareerAI Advisor to GitHub..."

# Check if repository exists on GitHub
echo "📋 Make sure you've created the repository 'careerai-advisor' on GitHub first!"
echo "Repository URL: https://github.com/kirankishoreV-07/careerai-advisor"
echo ""

# Push to GitHub
echo "📤 Pushing deployment-ready branch..."
git push -u origin deployment-ready

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Repository URLs:"
    echo "   Main: https://github.com/kirankishoreV-07/careerai-advisor"
    echo "   Branch: https://github.com/kirankishoreV-07/careerai-advisor/tree/deployment-ready"
    echo ""
    echo "🔗 Next Steps:"
    echo "1. Go to your repository on GitHub"
    echo "2. Create a Pull Request from 'deployment-ready' to 'main'"
    echo "3. Set up GitHub Secrets for deployment (see ENV_VARIABLES_GUIDE.md)"
    echo "4. Connect to Vercel for automatic deployments"
    echo ""
    echo "📚 Documentation available:"
    echo "   • COMPLETE_DEPLOYMENT_GUIDE.md"
    echo "   • ENV_VARIABLES_GUIDE.md"
    echo "   • README.md"
else
    echo "❌ Failed to push to GitHub"
    echo "💡 Make sure you've created the repository on GitHub first:"
    echo "   1. Go to https://github.com/kirankishoreV-07"
    echo "   2. Click 'New repository'"
    echo "   3. Name it 'careerai-advisor'"
    echo "   4. Don't initialize with README/gitignore"
    echo "   5. Create the repository"
    echo "   6. Run this script again"
fi
