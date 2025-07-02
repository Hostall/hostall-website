# Complete Cloudflare Setup Guide

Here's exactly what you need to do on Cloudflare to get your API tokens and set up hosting for your HOSTALL website.

## Step 1: Sign Up or Log In to Cloudflare

1. Go to [cloudflare.com](https://www.cloudflare.com)
2. Sign up for a free account or log in if you already have one
3. Complete email verification if it's a new account

## Step 2: Get Your Account ID

### How to Find Your Account ID:
1. After logging in, you'll be on the Cloudflare dashboard
2. Look on the right sidebar for **"Account ID"**
3. It's a string like: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
4. **Copy this Account ID** - you'll need it for GitHub secrets

## Step 3: Create Cloudflare Pages Project

### Create Your Pages Project:
1. In Cloudflare dashboard, click **"Pages"** in the left sidebar
2. Click **"Create a project"**
3. Choose **"Connect to Git"** option
4. Connect your GitHub account if asked
5. Select your HOSTALL repository
6. For **"Project name"**, enter: `hostall-website`
7. Set **"Production branch"** to: `main` (or `master`)
8. Leave other settings as default
9. Click **"Save and Deploy"**

**Important**: The project name must be exactly `hostall-website` to match your workflow file.

## Step 4: Get Your API Token

### Create API Token:
1. Click on your profile picture (top right)
2. Select **"My Profile"**
3. Go to **"API Tokens"** tab
4. Click **"Create Token"**
5. Click **"Get started"** next to **"Custom token"**

### Configure Your Token:
**Permissions**:
- Zone - Zone Settings: Edit
- Zone - Zone: Read  
- Account - Cloudflare Pages: Edit

**Account Resources**:
- Include - All accounts

**Zone Resources**:
- Include - All zones

6. Click **"Continue to summary"**
7. Click **"Create Token"**
8. **Copy the token immediately** - you won't see it again!

## Step 5: What You Should Have Now

After completing the steps above, you should have:

✅ **Cloudflare Account ID**: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p` (example)
✅ **Cloudflare API Token**: `abc123...` (long string starting with letters/numbers)
✅ **Pages Project**: Named `hostall-website` connected to your GitHub repo

## Step 6: Add These to GitHub Secrets

Now go back to GitHub and add these secrets:

1. **Secret Name**: `CLOUDFLARE_ACCOUNT_ID`
   **Value**: Your Account ID (from Step 2)

2. **Secret Name**: `CLOUDFLARE_API_TOKEN`
   **Value**: Your API Token (from Step 4)

## Step 7: First Deployment

Once you add the secrets:
1. Your Cloudflare Pages project will be ready
2. When your GitHub workflow runs, it will deploy to this project
3. You'll get a URL like: `hostall-website.pages.dev`

## Troubleshooting

**If you can't find Account ID**:
- Look in the right sidebar of Cloudflare dashboard
- It's usually labeled "Account ID" or "Account Details"

**If token creation fails**:
- Make sure you're on the "API Tokens" tab, not "API Keys"
- Use "Custom token" option, not the pre-made templates

**If Pages project creation fails**:
- Make sure your GitHub repo is public or Cloudflare has access
- The project name must be exactly `hostall-website`

## What Happens Next

After this setup:
1. Your GitHub workflow will be able to deploy to Cloudflare
2. Every code push will trigger automatic deployment
3. Your website will be live at `hostall-website.pages.dev`
4. The process takes 2-3 minutes per deployment