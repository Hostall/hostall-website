# Complete API Keys and Tokens Setup Guide

This guide provides detailed, step-by-step instructions for obtaining all the API keys and tokens needed for the HOSTALL project integration with GitHub, Supabase, and Cloudflare.

## 🔑 Keys and Tokens You Need

| Service | Key/Token Name | Purpose | Security Level |
|---------|----------------|---------|----------------|
| Supabase | Project URL | Connection endpoint | Public |
| Supabase | Anon/Public Key | Client-side operations | Public |
| Supabase | Service Role Key | Server-side operations | **SECRET** |
| Cloudflare | API Token | Deployment automation | **SECRET** |
| Cloudflare | Account ID | Account identification | Public |
| Google Maps | API Key | Map functionality | Public |
| Unsplash | Access Key | Image search | Public |
| Google Analytics | Tracking ID | Website analytics | Public |

## 1. 🗄️ Supabase API Keys

### Step 1: Access Your Supabase Project

1. **Login** to [Supabase Dashboard](https://app.supabase.com)
2. **Select** your HOSTALL project from the dashboard
3. **Navigate** to Project Settings by clicking the gear icon ⚙️ in the bottom left
4. **Click** on "API" in the left sidebar

### Step 2: Copy Your Project URL

```
🔗 Project URL Format: https://[your-project-id].supabase.co
```

1. **Find** the "Project URL" section at the top
2. **Copy** the entire URL (e.g., `https://abcdefghijklmnop.supabase.co`)
3. **Save** this as `SUPABASE_URL`

### Step 3: Copy Your Anon/Public Key

```
🔑 Anon Key: Used for client-side operations (safe to expose)
```

1. **Scroll down** to "Project API Keys" section
2. **Find** the key labeled "anon" or "public"
3. **Click** the copy button or select all text
4. **Save** this as `SUPABASE_ANON_KEY`

### Step 4: Copy Your Service Role Key

```
⚠️ Service Role Key: NEVER expose this in client code!
```

1. **In the same** "Project API Keys" section
2. **Find** the key labeled "service_role" (it's longer than the anon key)
3. **Click** the copy button
4. **Save** this as `SUPABASE_SERVICE_ROLE_KEY`

**🚨 SECURITY WARNING**: This key bypasses Row-Level Security and has admin access. Only use in secure environments like GitHub Actions!

## 2. ☁️ Cloudflare API Token

### Step 1: Access Cloudflare API Tokens

1. **Login** to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Click** your profile icon in the top-right corner
3. **Select** "My Profile"
4. **Click** "API Tokens" in the left sidebar

### Step 2: Create a New API Token

1. **Click** "Create Token" button
2. **Choose** one of these options:

#### Option A: Use Template (Recommended)
1. **Find** "Edit Cloudflare Workers" template
2. **Click** "Use template"
3. **Modify** permissions to include:
   - Account: Cloudflare Pages - Edit
   - Account: Account Settings - Read
   - Zone: Zone - Read (if using custom domain)

#### Option B: Create Custom Token
1. **Click** "Create Custom Token"
2. **Set** token name: `HOSTALL Deployment Token`
3. **Configure** permissions:

| Permission Type | Service | Access Level |
|----------------|---------|--------------|
| Account | Cloudflare Pages | Edit |
| Account | Account Settings | Read |
| Zone | Zone | Read |
| Zone | Workers Routes | Edit |

### Step 3: Configure Token Resources

1. **Account Resources**: Select "Include - All accounts"
2. **Zone Resources**: Select "Include - All zones" (or specific zones)
3. **Client IP Address Filtering**: Leave as "Is in - [blank]" (no restrictions)

### Step 4: Set Token Expiration

1. **Expiration**: Set to 1 year from now (recommended)
2. **Click** "Continue to summary"
3. **Review** your settings
4. **Click** "Create Token"

### Step 5: Copy Your Token

```
🔑 Copy this token immediately - it won't be shown again!
```

1. **Copy** the entire token (starts with something like `1a2b3c4d...`)
2. **Save** this as `CLOUDFLARE_API_TOKEN`
3. **Click** "Done" after copying

## 3. 🏢 Cloudflare Account ID

### Method 1: From Dashboard URL
1. **Look** at your browser URL when logged into Cloudflare
2. **Format**: `https://dash.cloudflare.com/[ACCOUNT_ID]/...`
3. **Copy** the account ID from the URL

### Method 2: From Dashboard Sidebar
1. **Go** to any section in your Cloudflare dashboard
2. **Look** at the right sidebar under "API"
3. **Find** "Account ID" and copy it

### Method 3: From Account Settings
1. **Click** your profile → "My Profile"
2. **Go** to "Account API" section
3. **Copy** the Account ID shown

```
📝 Account ID Format: 32-character string (e.g., 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p)
```

**Save** this as `CLOUDFLARE_ACCOUNT_ID`

## 4. 🗺️ Google Maps API Key

### Step 1: Access Google Cloud Console

1. **Go** to [Google Cloud Console](https://console.cloud.google.com)
2. **Login** with your Google account
3. **Create** a new project or select existing one
4. **Enable** the Google Maps JavaScript API

### Step 2: Create API Key

1. **Navigate** to "APIs & Services" → "Credentials"
2. **Click** "Create Credentials" → "API Key"
3. **Copy** the generated API key immediately
4. **Click** "Restrict Key" for security

### Step 3: Configure API Key Restrictions

1. **Application restrictions**: Choose "HTTP referrers"
2. **Add** your domain(s):
   - `https://your-domain.com/*`
   - `https://hostall.pages.dev/*`
   - `http://localhost:*` (for development)

3. **API restrictions**: Select "Restrict key"
4. **Choose** these APIs:
   - Maps JavaScript API
   - Places API (if using place search)
   - Geocoding API (if using address lookup)

5. **Save** the restrictions

**Save** this as `GOOGLE_MAPS_API_KEY`

## 5. 📸 Unsplash API Key

### Step 1: Create Unsplash Developer Account

1. **Go** to [Unsplash Developers](https://unsplash.com/developers)
2. **Sign up** or login to your Unsplash account
3. **Click** "Register as a developer"
4. **Fill** out the developer profile

### Step 2: Create New Application

1. **Click** "New Application"
2. **Accept** the terms and conditions
3. **Fill** out application details:
   - Application name: `HOSTALL`
   - Description: `Hostel management platform`
   - Website URL: Your website URL

4. **Submit** the application

### Step 3: Get Your Access Key

1. **Go** to your application dashboard
2. **Find** "Access Key" (not "Secret Key")
3. **Copy** the access key

**Save** this as `UNSPLASH_ACCESS_KEY`

## 6. 📊 Google Analytics Tracking ID

### Step 1: Set Up Google Analytics

1. **Go** to [Google Analytics](https://analytics.google.com)
2. **Sign in** with your Google account
3. **Click** "Start measuring"
4. **Create** an account for your project

### Step 2: Set Up Property

1. **Property name**: `HOSTALL`
2. **Time zone**: Select your timezone
3. **Currency**: Select your currency
4. **Click** "Next"

### Step 3: Choose Platform

1. **Select** "Web"
2. **Enter** your website URL
3. **Stream name**: `HOSTALL Website`
4. **Click** "Create stream"

### Step 4: Get Your Measurement ID

1. **Find** your Measurement ID (format: `G-XXXXXXXXXX`)
2. **For HOSTALL**: Use `G-0NNWGNQE5Q` (already configured)

**Save** this as `GOOGLE_ANALYTICS_ID`

## 7. 🔐 Setting Up GitHub Secrets

### Step 1: Access Repository Secrets

1. **Go** to your GitHub repository
2. **Click** "Settings" tab
3. **Click** "Secrets and variables" → "Actions"

### Step 2: Add Each Secret

**Click** "New repository secret" for each of these:

#### Secret 1: Supabase URL
- **Name**: `SUPABASE_URL`
- **Secret**: `https://[your-project-id].supabase.co`

#### Secret 2: Supabase Anon Key
- **Name**: `SUPABASE_ANON_KEY`
- **Secret**: [Your anon/public key]

#### Secret 3: Supabase Service Role Key
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Secret**: [Your service role key]

#### Secret 4: Cloudflare API Token
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Secret**: [Your API token]

#### Secret 5: Cloudflare Account ID
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Secret**: [Your account ID]

#### Optional Secrets (for enhanced features):

#### Secret 6: Google Maps API Key
- **Name**: `GOOGLE_MAPS_API_KEY`
- **Secret**: [Your Google Maps API key]

#### Secret 7: Unsplash Access Key
- **Name**: `UNSPLASH_ACCESS_KEY`
- **Secret**: [Your Unsplash access key]

#### Secret 8: Discord Webhook (for notifications)
- **Name**: `DISCORD_WEBHOOK_URL`
- **Secret**: [Your Discord webhook URL]

## 8. 🌐 Environment Variables for Cloudflare Pages

### In Cloudflare Pages Project Settings:

1. **Go** to your Cloudflare Pages project
2. **Click** "Settings" → "Environment variables"
3. **Add** these variables for **Production**:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `SUPABASE_URL` | https://[project-id].supabase.co | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | [anon-key] | Public Supabase API key |
| `GOOGLE_MAPS_API_KEY` | [maps-key] | Google Maps API key |
| `GOOGLE_ANALYTICS_ID` | G-0NNWGNQE5Q | Analytics tracking ID |
| `UNSPLASH_ACCESS_KEY` | [unsplash-key] | Unsplash API access key |

**⚠️ IMPORTANT**: Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to Cloudflare environment variables!

## 9. ✅ Verification Checklist

### GitHub Secrets ✅
- [ ] `SUPABASE_URL` is set
- [ ] `SUPABASE_ANON_KEY` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] `CLOUDFLARE_API_TOKEN` is set
- [ ] `CLOUDFLARE_ACCOUNT_ID` is set

### Cloudflare Environment Variables ✅
- [ ] `SUPABASE_URL` is set (production)
- [ ] `SUPABASE_ANON_KEY` is set (production)
- [ ] `GOOGLE_MAPS_API_KEY` is set (production)
- [ ] `GOOGLE_ANALYTICS_ID` is set (production)
- [ ] `UNSPLASH_ACCESS_KEY` is set (production)

### API Key Security ✅
- [ ] Google Maps key is restricted to your domains
- [ ] Cloudflare token has minimal required permissions
- [ ] Service role key is only in GitHub secrets
- [ ] All keys have appropriate expiration dates set

## 10. 🧪 Testing Your Keys

### Test Supabase Connection
```javascript
// Add this to your browser console on your deployed site
const supabase = window.supabase;
if (supabase) {
  supabase.from('hostels').select('count').then(console.log);
} else {
  console.log('Supabase not initialized');
}
```

### Test Cloudflare Deployment
1. **Push** a small change to your main branch
2. **Check** GitHub Actions tab for successful deployment
3. **Verify** your site updates on Cloudflare Pages

### Test Google Maps
1. **Visit** your deployed site
2. **Check** if maps load correctly
3. **Look** for any console errors related to maps

### Test Unsplash API
1. **Try** the image search functionality in your admin panel
2. **Verify** images load from Unsplash
3. **Check** network tab for successful API calls

## 🚨 Security Best Practices

### Do's ✅
- **Rotate** API keys every 3-6 months
- **Use** environment-specific keys when possible
- **Monitor** API usage for unusual activity
- **Set** expiration dates on all tokens
- **Restrict** API keys to specific domains/IPs when possible

### Don'ts ❌
- **Never** commit API keys to your repository
- **Never** expose service role keys in client code
- **Never** share API keys in chat or email
- **Never** use production keys in development
- **Never** leave API keys unrestricted

## 🔧 Troubleshooting Common Issues

### "Invalid API Key" Errors
- **Double-check** that you copied the key correctly
- **Verify** there are no extra spaces or characters
- **Check** if the key has expired
- **Ensure** you're using the right key for the right service

### "Insufficient Permissions" Errors
- **Review** the permissions on your Cloudflare token
- **Recreate** the token with broader permissions if needed
- **Check** that your GitHub secrets are set correctly

### "CORS" Errors with Supabase
- **Go** to Supabase Authentication settings
- **Add** your deployed domain to allowed origins
- **Include** both your custom domain and Cloudflare Pages URL

### Environment Variables Not Working
- **Check** that variables are set for the correct environment
- **Verify** variable names match exactly (case-sensitive)
- **Redeploy** your site after adding new variables

---

With all these keys and tokens properly set up, your HOSTALL project will have full integration between GitHub, Supabase, and Cloudflare with automated deployments and real-time functionality!