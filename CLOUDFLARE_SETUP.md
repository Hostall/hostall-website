# Cloudflare Pages Setup Guide

This guide explains how to set up Cloudflare Pages for the HOSTALL platform and configure the necessary settings for optimal performance and security.

## 1. Create a Cloudflare Account

If you don't already have a Cloudflare account:

1. Go to [Cloudflare](https://dash.cloudflare.com/sign-up)
2. Sign up with your email and create a password
3. Verify your email address

## 2. Set Up Cloudflare Pages Project

1. Log in to your Cloudflare dashboard
2. In the sidebar, click on "Pages"
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose GitHub as your Git provider and authorize Cloudflare to access your repositories
6. Select the HOSTALL repository from the list
7. Configure your build settings:

| Setting | Value |
|---------|-------|
| Project name | `hostall` |
| Production branch | `main` |
| Framework preset | None |
| Build command | _Leave empty_ |
| Build output directory | `.` (root directory) |
| Root directory | _Leave empty_ |
| Environment variables | _Set up in next section_ |

8. Click "Save and Deploy"

## 3. Configure Environment Variables

In your Cloudflare Pages project settings:

1. Go to "Settings" tab
2. Scroll down to "Environment variables"
3. Add the following variables:

| Variable Name | Description |
|---------------|-------------|
| `SUPABASE_URL` | URL of your Supabase project |
| `SUPABASE_ANON_KEY` | Public API key for Supabase |
| `GOOGLE_MAPS_API_KEY` | API key for Google Maps integration |
| `GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID |
| `UNSPLASH_ACCESS_KEY` | Access key for Unsplash API |

Note: Do NOT add `SUPABASE_SERVICE_ROLE_KEY` as an environment variable in Cloudflare Pages settings. This sensitive key should only be used in GitHub Actions secrets.

## 4. Set Up Custom Domain (Optional)

1. In your Cloudflare Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain name (e.g., hostall.com)
4. Follow the instructions to verify domain ownership and configure DNS
5. Choose HTTPS setting (recommended: "Strict")

## 5. Configure Security Headers

For enhanced security, add custom headers to your Cloudflare Pages deployment:

1. Go to your Cloudflare Pages project settings
2. Click on "Functions"
3. Create a new file named `_headers` in your repository root with the following content:

```
/*
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(self)
  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://www.google-analytics.com https://www.googletagmanager.com 'unsafe-inline'; style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://maps.googleapis.com https://www.google-analytics.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://maps.googleapis.com; frame-src 'self' https://www.google.com
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

4. Commit and push this file to your repository

## 6. Set Up Cloudflare Workers for Enhanced Features (Optional)

To implement edge caching, analytics, and security features:

1. In your Cloudflare dashboard, go to "Workers & Pages"
2. Click "Create a Worker"
3. Set up a worker to handle caching or security for your HOSTALL application
4. Deploy the worker and configure routes to your domain

## 7. Configure Cache Settings

For optimal performance:

1. Go to your Cloudflare dashboard → "Caching"
2. Configure Browser Cache TTL (recommended: "Respect existing headers")
3. Enable Tiered Cache for faster global response
4. Set up Page Rules for specific caching behaviors if needed

## 8. Set Up Analytics

1. In your Cloudflare dashboard, go to "Analytics"
2. Enable Web Analytics for your domain
3. Copy the analytics tag and add it to your site (or use existing Google Analytics)

## 9. Test Your Deployment

After configuration is complete:

1. Visit your Cloudflare Pages URL (or custom domain)
2. Verify all functionality works as expected
3. Test the site on different devices and browsers
4. Check that security features are working using security testing tools

## Troubleshooting Common Issues

### Build Failures
- Check that your repository structure is correct
- Verify that all required files are included
- Examine build logs for specific errors

### Custom Domain Issues
- Confirm DNS records are properly configured
- Wait for DNS propagation (can take up to 48 hours)
- Verify SSL/TLS certificate is properly provisioned

### Performance Issues
- Check cache hit rates in Cloudflare Analytics
- Optimize images and assets if needed
- Consider enabling Auto Minify for HTML, CSS, and JavaScript

For more help, refer to [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/) or contact Cloudflare support.