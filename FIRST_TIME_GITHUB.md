# Setting Up Your First GitHub Repository for HOSTALL

This guide will walk you through creating your first GitHub repository for the HOSTALL project, from creating a GitHub account to pushing your code and setting up automated workflows.

## 1. Create a GitHub Account (Skip if you already have one)

1. Go to [GitHub.com](https://github.com) and click "Sign up"
2. Enter your email, create a password, and choose a username
3. Verify your email address when prompted
4. Complete the GitHub sign-up process by following the on-screen instructions

## 2. Install Git on Your Computer (Skip if already installed)

### Windows
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with default options
3. Open Command Prompt or PowerShell and type `git --version` to verify installation

### macOS
1. Install Git using Homebrew: `brew install git`
   (If you don't have Homebrew, install it from [brew.sh](https://brew.sh))
2. Or download from [git-scm.com](https://git-scm.com/download/mac)
3. Open Terminal and type `git --version` to verify installation

### Linux (Ubuntu/Debian)
1. Open Terminal and run `sudo apt update && sudo apt install git`
2. Verify with `git --version`

## 3. Configure Git (One-time setup)

Open Terminal or Command Prompt and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Use the same email address as your GitHub account.

## 4. Create a New Repository on GitHub

1. Log in to GitHub
2. Click the "+" icon in the top-right corner and select "New repository"
3. Fill in the repository details:
   - **Repository name**: `hostall` (or your preferred name)
   - **Description**: "HOSTALL - Hostel Management Platform for Lahore"
   - **Visibility**: Choose "Private" (recommended for production code)
   - **Initialize this repository with**: Leave all checkboxes unchecked for now
4. Click "Create repository"

## 5. Initialize Your Local Repository

Navigate to your HOSTALL project directory in Terminal/Command Prompt:

```bash
# Navigate to your project directory (adjust the path as needed)
cd /path/to/your/hostall/project

# Initialize Git repository
git init

# Verify Git is initialized
git status
```

You should see a message that you're on branch "master" or "main" with untracked files.

## 6. Add Your Files to the Repository

```bash
# Add all files to staging
git add .

# Verify files are staged
git status
```

You should see all your files listed as "Changes to be committed".

## 7. Make Your First Commit

```bash
# Commit all files with a message
git commit -m "Initial commit: HOSTALL platform"

# Verify the commit
git log
```

You should see your commit with the message and your name/email.

## 8. Connect Your Local Repository to GitHub

After creating your repository on GitHub, you'll see instructions. Use the commands:

```bash
# Connect your local repository to GitHub (replace with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hostall.git

# Verify the remote connection
git remote -v
```

You should see your GitHub repository URL listed as "origin".

## 9. Push Your Code to GitHub

```bash
# Push your code to GitHub (if on 'main' branch)
git push -u origin main

# If you're on 'master' branch instead
git push -u origin master
```

You may be prompted to enter your GitHub username and password or personal access token.

### If you get an authentication error:

GitHub now requires a personal access token instead of password for command line operations:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Give it a name (e.g., "HOSTALL Project")
3. Select scopes: at minimum, select "repo" for full repository access
4. Click "Generate token" and copy the token
5. Use this token as your password when prompted

## 10. Set Up GitHub Secrets for CI/CD Workflows

For the automated workflows to function, you need to add secrets:

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each of the following secrets:

| Secret Name | Description | Where to Find |
|-------------|-------------|--------------|
| `CLOUDFLARE_API_TOKEN` | Token for Cloudflare deployments | Cloudflare dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Cloudflare dashboard → Right sidebar |
| `SUPABASE_URL` | Your Supabase project URL | Supabase dashboard → Project Settings → API |
| `SUPABASE_ANON_KEY` | Public API key | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key (keep this secure!) | Supabase dashboard → Project Settings → API |
| `DISCORD_WEBHOOK_URL` | (Optional) For notifications | Discord server → Integrations → Webhooks |

## 11. Basic GitHub Concepts

- **Repository**: Your project's storage location on GitHub
- **Commit**: A saved snapshot of your code at a point in time
- **Branch**: A separate line of development (default is 'main' or 'master')
- **Push**: Sending your local commits to GitHub
- **Pull**: Getting changes from GitHub to your local repository
- **Pull Request**: A request to merge changes from one branch to another
- **Actions**: GitHub's built-in CI/CD system (what we've set up for automated deployments)

## 12. Understanding the Workflows

Your repository contains three GitHub Actions workflows in the `.github/workflows/` directory:

1. **deploy.yml**: Automatically deploys your site when you push to the main branch
2. **manual-deploy.yml**: Allows manual deployment from the GitHub Actions tab
3. **deploy-edge-functions.yml**: Specifically for deploying Supabase Edge Functions

## 13. Making Changes Going Forward

For future changes to your project:

```bash
# Pull any changes from GitHub first (good practice)
git pull

# Make your changes to files

# Add the changes
git add .

# Commit with a descriptive message
git commit -m "Add new feature: describe what you changed"

# Push to GitHub
git push
```

When you push to the main branch, the GitHub Actions workflows will automatically deploy your changes.

## 14. Checking Deployment Status

1. Go to your GitHub repository
2. Click the "Actions" tab
3. You'll see your workflows running or completed
4. Click on a workflow run to see details and logs

## Troubleshooting Common Issues

### "Permission denied" when pushing
- Ensure you're using a personal access token as your password
- Check that you have write access to the repository

### "Failed to push some refs"
- Someone else made changes to the repository
- Run `git pull` first, resolve any conflicts, then push again

### Workflow failures
- Check the detailed logs in the Actions tab
- Ensure all required secrets are correctly set up
- Verify your code builds and runs locally first

## Getting Help

If you encounter issues:
- Check GitHub's [documentation](https://docs.github.com/en)
- Visit [Stack Overflow](https://stackoverflow.com/questions/tagged/github)
- Join GitHub's [Community Forum](https://github.community/)