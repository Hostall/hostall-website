# GitHub Secrets Setup Guide for HOSTALL

This guide provides comprehensive instructions for setting up all required GitHub secrets for the HOSTALL project's CI/CD workflows.

## Required Secrets Overview

The following secrets are required for full functionality of the GitHub Actions workflows:

### 🔐 Essential Secrets (Required)
- `CLOUDFLARE_API_TOKEN` - For Cloudflare Pages deployment
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account identifier
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin/service key

### 📢 Optional Secrets (Recommended)
- `DISCORD_WEBHOOK_URL` - For deployment notifications
- `SNYK_TOKEN` - For enhanced security scanning
- `LHCI_GITHUB_APP_TOKEN` - For Lighthouse CI integration

### 🏢 Organization Secrets (Advanced)
- `NPM_TOKEN` - For private npm packages (if needed)
- `SENTRY_DSN` - For error monitoring (if using Sentry)

## Step-by-Step Setup Instructions

### 1. Access GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2. Cloudflare Secrets

#### Get Cloudflare API Token
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use **Edit Cloudflare Workers** template or create custom token with:
   - **Zone Resources**: `Include - All zones`
   - **Account Resources**: `Include - All accounts`
   - **Permissions**:
     - `Zone:Zone:Read`
     - `Zone:Page Rule:Edit`
     - `Account:Cloudflare Pages:Edit`

**Secret Name**: `CLOUDFLARE_API_TOKEN`
**Secret Value**: `your-cloudflare-api-token`

#### Get Cloudflare Account ID
1. In Cloudflare Dashboard, go to any domain
2. In the right sidebar, copy the **Account ID**

**Secret Name**: `CLOUDFLARE_ACCOUNT_ID`
**Secret Value**: `your-account-id`

### 3. Supabase Secrets

#### Get Supabase URL and Keys
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your HOSTALL project
3. Go to **Settings** → **API**

**Secret Name**: `SUPABASE_URL`
**Secret Value**: `https://your-project-ref.supabase.co`

**Secret Name**: `SUPABASE_ANON_KEY`
**Secret Value**: `your-anon-public-key`

**Secret Name**: `SUPABASE_SERVICE_ROLE_KEY`
**Secret Value**: `your-service-role-secret-key`

⚠️ **Important**: Keep the service role key secure - it has admin access to your database!

### 4. Discord Notifications (Optional)

#### Create Discord Webhook
1. In your Discord server, go to **Server Settings** → **Integrations**
2. Click **Webhooks** → **New Webhook**
3. Name it "HOSTALL Deployments"
4. Select the channel for notifications
5. Copy the webhook URL

**Secret Name**: `DISCORD_WEBHOOK_URL`
**Secret Value**: `https://discord.com/api/webhooks/your-webhook-url`

### 5. Security Scanning (Optional)

#### Get Snyk Token
1. Sign up at [Snyk.io](https://snyk.io/)
2. Go to **Account Settings** → **API Token**
3. Copy your API token

**Secret Name**: `SNYK_TOKEN`
**Secret Value**: `your-snyk-api-token`

### 6. Lighthouse CI (Optional)

#### Setup Lighthouse CI
1. Install the Lighthouse CI GitHub App
2. Configure the app for your repository
3. Get the token from Lighthouse CI dashboard

**Secret Name**: `LHCI_GITHUB_APP_TOKEN`
**Secret Value**: `your-lighthouse-ci-token`

## Environment-Specific Secrets

### Production Environment
Set these secrets for production deployments:

```
CLOUDFLARE_API_TOKEN_PROD=your-production-token
SUPABASE_URL_PROD=your-production-supabase-url
SUPABASE_ANON_KEY_PROD=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY_PROD=your-production-service-key
```

### Staging Environment
Set these secrets for staging deployments:

```
CLOUDFLARE_API_TOKEN_STAGING=your-staging-token
SUPABASE_URL_STAGING=your-staging-supabase-url
SUPABASE_ANON_KEY_STAGING=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY_STAGING=your-staging-service-key
```

## Secrets Validation

### Test Your Secrets

After setting up secrets, you can test them using this workflow:

1. Go to **Actions** tab in your repository
2. Select **Test and Security Scan** workflow
3. Click **Run workflow** → **Run workflow**
4. Monitor the workflow execution for any secret-related errors

### Common Issues and Solutions

#### ❌ "Invalid API Token"
- **Cause**: Wrong Cloudflare API token or insufficient permissions
- **Solution**: Regenerate token with correct permissions

#### ❌ "Unauthorized: Invalid JWT"
- **Cause**: Wrong Supabase keys or project URL
- **Solution**: Double-check keys from Supabase dashboard

#### ❌ "Webhook URL not found"
- **Cause**: Discord webhook was deleted or URL is incorrect
- **Solution**: Regenerate webhook URL in Discord

#### ❌ "Network unreachable"
- **Cause**: Supabase project is paused or URL is wrong
- **Solution**: Ensure Supabase project is active

## Security Best Practices

### Secret Management
- ✅ Use environment-specific secrets for production/staging
- ✅ Rotate secrets regularly (every 3-6 months)
- ✅ Use least-privilege principle for API tokens
- ✅ Monitor secret usage in audit logs
- ✅ Never commit secrets to code

### Access Control
- ✅ Limit repository access to trusted team members
- ✅ Use branch protection to prevent secret exposure
- ✅ Enable 2FA for all team members
- ✅ Regularly review repository access

### Monitoring
- ✅ Set up alerts for failed deployments
- ✅ Monitor API usage for unusual patterns
- ✅ Review deployment logs regularly
- ✅ Track secret access in GitHub audit logs

## Secrets Checklist

Use this checklist to ensure all secrets are properly configured:

### Essential Secrets ✅
- [ ] `CLOUDFLARE_API_TOKEN` - Working Cloudflare API token
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Correct account ID
- [ ] `SUPABASE_URL` - Valid Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Public API key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key (secure!)

### Optional Secrets ✅
- [ ] `DISCORD_WEBHOOK_URL` - Discord notifications
- [ ] `SNYK_TOKEN` - Security scanning
- [ ] `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI

### Testing ✅
- [ ] Manual workflow run successful
- [ ] Deployment to staging works
- [ ] Notifications are received
- [ ] Security scans complete
- [ ] No secret-related errors in logs

## Troubleshooting Commands

### Test Cloudflare Connection
```bash
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json"
```

### Test Supabase Connection
```bash
curl -X GET "YOUR_SUPABASE_URL/rest/v1/" \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Test Discord Webhook
```bash
curl -H "Content-Type: application/json" \
     -d '{"content": "Test message from HOSTALL CI/CD"}' \
     YOUR_DISCORD_WEBHOOK_URL
```

## Getting Help

If you encounter issues with secrets setup:

1. **Check GitHub Actions logs** for specific error messages
2. **Verify API token permissions** in respective service dashboards
3. **Test connections manually** using the troubleshooting commands
4. **Contact support** for the specific service (Cloudflare, Supabase, etc.)
5. **Review this guide** for any missed steps

Remember: Never share your secrets or commit them to code! Keep them secure and rotate them regularly.