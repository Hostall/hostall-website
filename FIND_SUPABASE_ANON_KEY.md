# How to Find Your Supabase Anon Key

Follow these simple steps to get your Supabase anon key:

## Step 1: Log in to Supabase
- Go to [app.supabase.com](https://app.supabase.com)
- Log in with your account credentials

## Step 2: Select Your Project
- Select your HOSTALL project: **teamhostall Project (pjnqhdhlcgrrmfzscswv)**
- This will take you to the project dashboard

## Step 3: Go to Project Settings
- Click on the ⚙️ **Settings** icon in the left sidebar
- It's usually at the bottom of the sidebar

## Step 4: Find API Settings
- In the settings menu, click on **API**
- This section contains all your project's API credentials

## Step 5: Get the anon key
- Look for the section titled **Project API keys**
- You'll see a field labeled "**anon public**" with a key value
- There's a "Copy" button next to it
- Click the "Copy" button to copy the anon key to your clipboard

![Example of Supabase API keys location](https://supabase.com/docs/img/project-api-keys.png)

## Step 6: Use the anon key
- Paste this key as the value for the `SUPABASE_ANON_KEY` secret in GitHub
- Make sure you copy the entire key without any extra spaces

## What does the anon key look like?
- It's a long string that typically starts with "eyJ..."
- Example format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...`
- Your actual key will be different

## Important Security Notes
- The anon key is public and safe to use in client-side code
- It has limited permissions based on your Row Level Security (RLS) policies
- Never share your service_role key, which has full admin access