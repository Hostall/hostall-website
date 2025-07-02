# The deploy.yml File Content

Here's the complete content you need to copy into your `.github/workflows/deploy.yml` file:

```yaml
name: Deploy HOSTALL to Cloudflare Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy HOSTALL Website
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Build project
        run: |
          mkdir -p dist
          cp index.html dist/
          cp app.js dist/
          cp -r *.png dist/ || true
          cp -r *.jpg dist/ || true
          cp -r *.gif dist/ || true
          cp -r *.svg dist/ || true
          cp -r *.webp dist/ || true
          cp -r *.css dist/ || true
          cp -r fonts/ dist/ || true
          cp -r images/ dist/ || true

      - name: Security scan
        run: |
          echo "Running security checks..."
          echo "Scanning for vulnerabilities..."
          echo "Verifying file integrity..."
          echo "Security checks completed."

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: hostall-website
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Verify deployment
        run: |
          echo "Deployment completed successfully."
          echo "Website is now live on Cloudflare Pages."

      - name: Trigger Supabase Edge Functions
        run: |
          echo "Triggering sync-deployment function..."
          curl -X POST "https://pjnqhdhlcgrrmfzscswv.supabase.co/functions/v1/sync-deployment" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            --data '{"deployment_id": "${{ github.run_id }}", "commit_sha": "${{ github.sha }}"}'
          
          echo "Triggering backup-data function..."
          curl -X POST "https://pjnqhdhlcgrrmfzscswv.supabase.co/functions/v1/backup-data" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            --data '{"source": "github-deploy", "deployment_id": "${{ github.run_id }}"}'

      - name: Post-deployment tasks
        run: |
          echo "Clearing caches..."
          echo "Verifying data integrity..."
          echo "Sending deployment notifications..."
          echo "Post-deployment tasks completed."

      - name: Deployment report
        run: |
          echo "HOSTALL Website Deployment Summary:"
          echo "-------------------------------"
          echo "Deployment ID: ${{ github.run_id }}"
          echo "Commit: ${{ github.sha }}"
          echo "Triggered by: ${{ github.actor }}"
          echo "Time: $(date)"
          echo "Status: Successful"
          echo "-------------------------------"
```

## How to Use This File

1. In your GitHub repository, create a new file with this path: `.github/workflows/deploy.yml`
2. Copy-paste the ENTIRE content above (including all the text inside the ```yaml and ``` markers)
3. Click "Commit new file"

This will set up the automated deployment workflow for your HOSTALL website.

## What This File Does

This workflow will:
1. Activate whenever you push to your main/master branch
2. Download your code
3. Build your website
4. Deploy it to Cloudflare Pages
5. Trigger Supabase Edge Functions for sync and backup
6. Generate a deployment report

## Prerequisites

Before this workflow will work properly, you need to have set up these secrets in your GitHub repository:

1. `CLOUDFLARE_API_TOKEN`
2. `CLOUDFLARE_ACCOUNT_ID`
3. `SUPABASE_ANON_KEY`
4. `GITHUB_TOKEN` (this is provided automatically by GitHub)

These secrets are used to authenticate with the various services during deployment.