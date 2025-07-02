# Creating a Cloudflare API Token for GitHub Actions

This guide explains how to create the proper Cloudflare API token needed for GitHub Actions to deploy your HOSTALL project to Cloudflare Pages.

## What You Need This For

GitHub Actions needs an API token to:
- Deploy your website to Cloudflare Pages
- Update your Cloudflare settings
- Configure custom domains
- Purge cache when needed

## Step 1: Access the API Tokens Page

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your profile icon in the top-right corner
3. Select **"My Profile"**
4. In the sidebar, click on **"API Tokens"**

## Step 2: Create a New API Token

1. Click the **"Create Token"** button
2. In the "API token templates" section, select **"Edit Cloudflare Workers"**
3. Alternatively, you can click on **"Create Custom Token"** for more specific permissions

## Step 3: Configure Token Permissions

For a custom token, configure these exact permissions:

| Access | Permission | Resources |
|---------|------------|-----------|
| Account | Cloudflare Pages | Edit |
| Account | Account Settings | Read |
| Zone | Zone | Read |
| Zone | Workers Routes | Edit |

## Step 4: Set Token Name and Expiration

1. Set a descriptive name like **"HOSTALL GitHub Actions Deployment"**
2. Set an expiration (Recommended: 1 year)
3. For Client IP Address Filtering, leave as "No IP Address Filtering" (or restrict if you prefer)

## Step 5: Configure Resources

1. In the "Account Resources" section:
   - Choose **"Include" → "All Accounts"**
2. In the "Zone Resources" section:
   - Choose **"Include" → "All Zones"** (or select specific zones)

## Step 6: Create and Secure Your Token

1. Review your settings to make sure permissions are correct
2. Click the **"Create Token"** button
3. **IMPORTANT**: Copy your token immediately and store it securely - it will only be shown once
4. Add this token as a GitHub secret called `CLOUDFLARE_API_TOKEN` as described in the main integration guide

## Step 7: Get Your Cloudflare Account ID

You'll also need your Cloudflare Account ID for GitHub Actions:

1. Go to the Cloudflare Dashboard
2. Select any of your websites/domains
3. On the right sidebar "API" section, copy your Account ID
4. Add this ID as a GitHub secret called `CLOUDFLARE_ACCOUNT_ID` as described in the main integration guide

## Step 8: Verify Token Permissions

To verify your token works correctly, you can test it with a simple cURL command:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json"
```

Replace `YOUR_API_TOKEN` with your actual token. 

A successful response will look like:

```json
{
  "success": true,
  "messages": [],
  "errors": [],
  "result": {
    "id": "your-token-id",
    "status": "active"
  }
}
```

## Troubleshooting

### Error: Insufficient Permissions

If you get "Insufficient permissions" errors in GitHub Actions:
1. Delete your existing token
2. Create a new token with all permissions listed in Step 3
3. Update the `CLOUDFLARE_API_TOKEN` secret in GitHub

### Error: Token Expired

If your token expires:
1. Create a new token following the steps above
2. Update the `CLOUDFLARE_API_TOKEN` secret in GitHub

### Error: Invalid Account ID

If you get "Invalid Account ID" errors:
1. Double-check your Account ID in the Cloudflare Dashboard
2. Make sure you're copying the Account ID, not the Zone ID

## Security Best Practices

1. **Set an expiration date** for your tokens (never use "Never" for production)
2. Consider **IP address filtering** for added security
3. Use the **minimum permissions needed** (the ones listed in step 3 are the minimum required)
4. **Rotate tokens** regularly (every few months)
5. **Monitor token usage** in Cloudflare Audit Logs

By following these steps, you'll have a properly configured Cloudflare API token that GitHub Actions can use to deploy your HOSTALL project to Cloudflare Pages.