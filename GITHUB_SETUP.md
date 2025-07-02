# GitHub Repository Setup Guide

This document explains how to set up your GitHub repository for HOSTALL and configure all required secrets for automated deployments.

## 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Fill in the repository details:
   - **Repository name**: `hostall` (or your preferred name)
   - **Description**: "HOSTALL - Hostel Management Platform"
   - **Visibility**: Private (recommended for production code)
   - **Initialize with**: Select "Add a README file" and "Choose a license" (MIT)
4. Click "Create repository"

## 2. Connect Local Repository to GitHub

Open your terminal and run the following commands in your project directory:

```bash
# Initialize Git repository (if not already done)
git init

# Add all files to staging
git add .

# Commit all files
git commit -m "Initial commit: HOSTALL platform"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/hostall.git

# Push code to GitHub
git push -u origin main
```

Note: Replace `YOUR_USERNAME` with your actual GitHub username.

## 3. Set Up Required Secrets for GitHub Actions

For the deployment automation to work, you need to set up several secrets:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret" and add each of the following:

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | Token for Cloudflare API access | Cloudflare dashboard → My Profile → API Tokens → Create Token (with Pages deployment permissions) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Cloudflare dashboard → Right sidebar → Copy Account ID |
| `SUPABASE_URL` | Your Supabase project URL | Supabase dashboard → Project → API settings → URL |
| `SUPABASE_ANON_KEY` | Public API key | Supabase dashboard → Project → API settings → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key | Supabase dashboard → Project → API settings → `service_role` |
| `GOOGLE_MAPS_API_KEY` | Google Maps integration | Google Cloud Console → APIs & Services → Credentials |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access | Unsplash Developer Portal → Your Applications |
| `DISCORD_WEBHOOK_URL` | Optional: For notifications | Discord → Server Settings → Integrations → Webhooks → Copy Webhook URL |

## 4. Configure Cloudflare Pages

1. Log in to your Cloudflare account
2. Go to "Pages" section
3. Click "Create a project"
4. Choose "Connect to Git" and select your GitHub repository
5. Configure your build settings:
   - **Project name**: `hostall`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: Leave empty or use `npm run build` if needed
   - **Build output directory**: `.` (root directory)
6. Click "Save and Deploy"

## 5. Test the Deployment

1. Make a small change to your code
2. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push
   ```
3. Go to your GitHub repository → "Actions" tab
4. You should see the workflow running and eventually complete
5. Check your Cloudflare Pages URL to verify the deployment

## 6. Optional: Set Up Branch Protection

For added security:

1. Go to your GitHub repository → "Settings" → "Branches"
2. Under "Branch protection rules" click "Add rule"
3. Enter "main" as the branch name pattern
4. Enable:
   - "Require pull request reviews before merging"
   - "Require status checks to pass before merging"
   - "Require signed commits"
5. Click "Create" to save the rule

## Troubleshooting Common Issues

### Deployment Failures
- Check that all secrets are correctly set
- Verify Cloudflare API token has the correct permissions
- Check GitHub Actions logs for specific errors

### Edge Functions Not Triggering
- Verify Supabase URL and keys are correct
- Check Supabase logs for function invocation errors
- Ensure Edge Functions are deployed correctly to Supabase

### Security Configuration
- Verify all security headers are properly set in the deployed version
- Test 2FA setup on the production environment
- Ensure environment variables are correctly loaded

For any additional questions or issues, please refer to the project documentation or contact the development team.