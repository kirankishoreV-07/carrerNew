# GitHub Actions Workflows Setup

The workflow files are stored in the `github-workflows/` directory to avoid permission issues during the initial push.

## How to Enable GitHub Actions

1. **Go to your repository**: https://github.com/kirankishoreV-07/carrerNew

2. **Create the workflows directory**:
   - Create a new folder: `.github/workflows/`

3. **Add the workflow files**:
   - Copy `github-workflows/deploy-gcp.yml` to `.github/workflows/deploy-gcp.yml`
   - Copy `github-workflows/deploy-vercel.yml` to `.github/workflows/deploy-vercel.yml`

4. **Set up GitHub Secrets** (Repository Settings → Secrets and variables → Actions):

### Required Secrets for Google Cloud Deployment:
- `GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY`: Content of your service account JSON file
- `NEXTAUTH_SECRET`: Your NextAuth secret key
- `GEMINI_API_KEY`: Your Gemini AI API key
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID

### Required Secrets for Vercel Deployment:
- `VERCEL_TOKEN`: Your Vercel token (from Vercel Dashboard → Settings → Tokens)
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Quick Setup Commands

After creating the `.github/workflows/` directory in your repository:

```bash
# Copy the workflow files to the correct location
cp github-workflows/deploy-gcp.yml .github/workflows/
cp github-workflows/deploy-vercel.yml .github/workflows/

# Commit and push
git add .github/workflows/
git commit -m "Add GitHub Actions workflows for automated deployment"
git push origin main
```

## Alternative: Manual Setup

1. Go to your GitHub repository
2. Click "Actions" tab
3. Click "New workflow"
4. Choose "set up a workflow yourself"
5. Copy and paste the content from the workflow files

## Workflow Features

### Google Cloud Deployment (`deploy-gcp.yml`):
- ✅ Automatic testing and linting
- ✅ Build validation
- ✅ Deploy to Google Cloud App Engine
- ✅ Triggers on push to main branch

### Vercel Deployment (`deploy-vercel.yml`):
- ✅ Automatic testing and linting
- ✅ TypeScript type checking
- ✅ Preview deployments for PRs
- ✅ Production deployment on main branch
- ✅ Deployment URL comments

## Troubleshooting

If workflows fail:
1. Check that all secrets are properly set
2. Verify service account permissions
3. Ensure API keys are valid
4. Check build logs for specific errors
