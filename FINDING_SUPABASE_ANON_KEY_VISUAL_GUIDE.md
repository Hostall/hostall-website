# Visual Guide: Finding Your Supabase Anon Key

Here's a step-by-step visual guide to help you find your Supabase anon key:

## Step 1: Log in to Supabase Dashboard
Go to [app.supabase.com](https://app.supabase.com) and log in to your account.

## Step 2: Select Your Project
Select your HOSTALL project: **teamhostall Project (pjnqhdhlcgrrmfzscswv)**

## Step 3: Go to Project Settings
Click on the ⚙️ **Settings** icon in the left sidebar (usually at the bottom).

## Step 4: Navigate to API Settings
In the settings menu, click on **API** section.

## Step 5: Find the Anon Key
Look for the section that says "Project API keys" - you'll see a field labeled "**anon public**" with your key.

## Visual Examples

### Example 1: Supabase API Keys Section
![Supabase API Keys Example](https://public.youware.com/users-website-assets/prod/eece562c-b820-4d93-ac82-ae67b689ba1d/51a650e9fdb542b3971142507e5b73ec.png)

### Example 2: Close-up of API Keys
![Supabase API Keys Close-up](https://public.youware.com/users-website-assets/prod/eece562c-b820-4d93-ac82-ae67b689ba1d/14cfa4788cf14aac9efe62f3c8d0e43f.png)

## What You're Looking For
- The "**anon public**" key is what you need
- Click the "Copy" button next to it
- It's a long string that typically starts with "eyJ..."
- Example format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...`

## What to Do With It
Once you have your anon key:
1. Go back to GitHub repository settings
2. Add a new repository secret named `SUPABASE_ANON_KEY`
3. Paste your anon key as the value
4. Click "Add secret"

## Important Security Notes
- The anon key is public and safe to use in client-side code
- It has limited permissions based on your Row Level Security (RLS) policies
- Never share your service_role key, which has full admin access