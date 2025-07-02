# GitHub + Supabase + Cloudflare Integration Guide for HOSTALL

This guide provides a focused, step-by-step process for connecting GitHub, Supabase, and Cloudflare for your HOSTALL project deployment pipeline.

## Overview of the Integration

This integration creates an automated workflow where:

1. You push code to GitHub
2. GitHub Actions automatically deploys to Cloudflare Pages
3. After deployment, Supabase Edge Functions are triggered for data synchronization
4. Your site is live with real-time database functionality

## Prerequisites

- GitHub account
- Supabase account with a project set up
- Cloudflare account
- Your HOSTALL codebase ready for deployment

## Step 1: Obtain Required API Keys and Tokens

### Supabase Keys
1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your HOSTALL project
3. Go to Project Settings → API
4. Copy these values:
   - **Project URL**: `https://[YOUR_PROJECT_ID].supabase.co`
   - **anon (public) key**: For client-side connections
   - **service_role key**: For server-side operations (keep secure!)

### Cloudflare API Token
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click your profile icon → My Profile
3. Select API Tokens → Create Token
4. Use the "Edit Cloudflare Workers" template or create a custom token with these permissions:
   - Account: Cloudflare Pages (Edit)
   - Account: Account Settings (Read)
   - Zone: Zone (Read)
   - Zone: Workers Routes (Edit)
5. Set a name (e.g., "HOSTALL Deployment") and expiration (1 year recommended)
6. Configure resources: Include → All Accounts
7. Create and copy the token immediately (shown only once)

### Cloudflare Account ID
1. In your Cloudflare Dashboard
2. Look at the right sidebar "API" section, or
3. Check the URL when logged in (format: `dash.cloudflare.com/[ACCOUNT_ID]`)
4. Copy your Account ID

## Step 2: Set Up GitHub Repository Secrets

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Add these repository secrets:

   ```
   SUPABASE_URL = https://[YOUR_PROJECT_ID].supabase.co
   SUPABASE_ANON_KEY = [your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]
   CLOUDFLARE_API_TOKEN = [your-cloudflare-api-token]
   CLOUDFLARE_ACCOUNT_ID = [your-cloudflare-account-id]
   ```

## Step 3: Create GitHub Actions Workflow File

1. Create a `.github/workflows` directory in your repository
2. Create a file named `deploy.yml` with the following content:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name=hostall
          
      - name: Trigger Supabase Edge Functions
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/sync-deployment" \
           -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
           -H "Content-Type: application/json" \
           -d '{"deployment":"production","commit":"${{ github.sha }}"}'
```

## Step 4: Set Up Cloudflare Pages Project

1. Log in to your Cloudflare Dashboard
2. Navigate to Pages → Create a project
3. Select "Connect to Git"
4. Authorize Cloudflare to access your GitHub repositories
5. Select your HOSTALL repository
6. Configure build settings:
   - Project name: `hostall`
   - Production branch: `main`
   - Framework preset: None
   - Build command: Leave empty
   - Build output directory: `.` (just a dot)
7. Click "Save and Deploy"

## Step 5: Configure Cloudflare Environment Variables

1. In your Cloudflare Pages project settings
2. Go to Environment variables
3. Add the following variables for production:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your anon/public key
   - `GOOGLE_ANALYTICS_ID`: G-0NNWGNQE5Q
4. **Important**: Do NOT add your `SUPABASE_SERVICE_ROLE_KEY` here
5. Click Save

## Step 6: Configure Supabase for Cloudflare Domain

1. Go to your Supabase dashboard → Authentication → URL Configuration
2. Add your Cloudflare Pages URL to the list of allowed URLs:
   - `https://hostall.pages.dev` (default Cloudflare Pages domain)
   - Your custom domain if you're using one
3. Save changes

## Step 7: Create Supabase Edge Functions

For the integrated sync-deployment function mentioned in the workflow:

1. Go to your Supabase dashboard → Edge Functions
2. Create a new function named `sync-deployment`
3. Use this sample code template:

```typescript
// sync-deployment.ts
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { deployment, commit } = await req.json();
    
    // Log deployment details
    console.log(`Deployment triggered: ${deployment} from commit ${commit}`);
    
    // Perform post-deployment tasks here
    // Examples:
    // - Clear caches
    // - Update deployment logs
    // - Send notifications
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Deployment sync completed successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
```

4. Deploy the Edge Function

## Step 8: Test the Integration

1. Make a small change to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test integration deployment"
   git push origin main
   ```
3. Watch the GitHub Actions workflow run in your repository's Actions tab
4. Verify successful deployment to Cloudflare Pages
5. Check Supabase logs to confirm Edge Function was triggered

## Branch Protection Recommendations

For better security and stability:

1. Go to your GitHub repository → Settings → Branches
2. Add a protection rule for the `main` branch
3. Enable these settings:
   - Require a pull request before merging
   - Require status checks to pass before merging
   - Require branches to be up to date
   - Include administrators in restrictions

## Troubleshooting Common Issues

### GitHub Actions Deployment Failure

- **Issue**: GitHub Actions workflow fails to deploy
- **Solution**:
  - Check that all secrets are correctly set
  - Verify your Cloudflare API token has sufficient permissions
  - Make sure account ID is correct
  - Check workflow file syntax

### Supabase Connection Issues

- **Issue**: Site deploys but can't connect to Supabase
- **Solution**:
  - Verify Supabase URL and anon key in environment variables
  - Check CORS settings in Supabase Authentication settings
  - Inspect browser console for connection errors

### Edge Function Not Triggering

- **Issue**: Post-deployment tasks not running
- **Solution**:
  - Check Edge Function logs in Supabase dashboard
  - Verify service role key has correct permissions
  - Ensure Edge Function is deployed and named correctly

## Security Best Practices

1. **Never commit API keys** directly to your code
2. **Use branch protection** to prevent accidental changes
3. **Regularly rotate API tokens** (recommend every 3-6 months)
4. **Monitor deployment logs** for unusual activity
5. **Set up Row-Level Security** in Supabase
6. **Implement CORS properly** in your Edge Functions

## Next Steps

After setting up this integration:

1. **Set up automated testing** in your GitHub Actions workflow
2. **Configure custom domain** in Cloudflare Pages
3. **Implement staging environment** with separate branches
4. **Set up monitoring and alerts** for both Cloudflare and Supabase
5. **Document your deployment process** for team members

---

For more detailed information on specific components, refer to:
- `GITHUB_SETUP.md`
- `CLOUDFLARE_SETUP.md`
- `CLOUDFLARE_API_GUIDE.md`
- `SUPABASE_API_GUIDE.md`
- `INTEGRATION_GUIDE.md`