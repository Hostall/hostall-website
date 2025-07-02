# Branch Protection Setup Guide for HOSTALL

This guide provides step-by-step instructions for setting up branch protection rules to ensure code quality and prevent accidental changes to important branches.

## Why Branch Protection?

Branch protection rules help:
- 🛡️ Prevent direct pushes to important branches
- 👥 Require code reviews before merging
- ✅ Ensure all tests pass before merging
- 🔄 Maintain a clean git history
- 🚀 Enforce consistent deployment practices

## Quick Setup Summary

1. **Main Branch**: Highly protected, production-ready code
2. **Develop Branch**: Protected, integration branch for features
3. **Feature Branches**: Minimal protection, development branches

## Step-by-Step Setup

### 1. Access Branch Protection Settings

1. Go to your GitHub repository
2. Click the **Settings** tab
3. In the left sidebar, click **Branches**
4. Click **Add rule** to create a new protection rule

### 2. Main Branch Protection

#### Branch Name Pattern
```
main
```

#### Protection Settings

**✅ Require a pull request before merging**
- ☑️ Require approvals: **2**
- ☑️ Dismiss stale PR approvals when new commits are pushed
- ☑️ Require review from code owners
- ☑️ Restrict pushes that create files that modify specified files

**✅ Require status checks to pass before merging**
- ☑️ Require branches to be up to date before merging
- Required status checks:
  - `security-scan`
  - `performance-test`
  - `code-quality`
  - `accessibility-test`
  - `deploy-staging` (if coming from develop)

**✅ Require conversation resolution before merging**

**✅ Require signed commits**

**✅ Require linear history**

**✅ Include administrators**

**✅ Restrict pushes that create files that modify specified files**
- Path: `package.json`
- Path: `supabase/migrations/*`
- Path: `.github/workflows/*`

**❌ Allow force pushes**: Disabled
**❌ Allow deletions**: Disabled

### 3. Develop Branch Protection

#### Branch Name Pattern
```
develop
```

#### Protection Settings

**✅ Require a pull request before merging**
- ☑️ Require approvals: **1**
- ☑️ Dismiss stale PR approvals when new commits are pushed
- ☐ Require review from code owners (optional)

**✅ Require status checks to pass before merging**
- ☑️ Require branches to be up to date before merging
- Required status checks:
  - `security-scan`
  - `code-quality`
  - `performance-test`

**✅ Require conversation resolution before merging**

**☐ Require signed commits** (optional)

**☐ Require linear history** (optional)

**☐ Include administrators** (for emergency fixes)

**❌ Allow force pushes**: Disabled
**❌ Allow deletions**: Disabled

### 4. Feature Branch Protection (Optional)

#### Branch Name Pattern
```
feature/*
```

#### Protection Settings

**☐ Require a pull request before merging** (optional)

**✅ Require status checks to pass before merging**
- Required status checks:
  - `security-scan`
  - `code-quality`

**❌ Allow force pushes**: Enabled (for development flexibility)
**❌ Allow deletions**: Enabled

### 5. Hotfix Branch Protection

#### Branch Name Pattern
```
hotfix/*
```

#### Protection Settings

**✅ Require a pull request before merging**
- ☑️ Require approvals: **1**
- ☑️ Fast-track for emergency fixes

**✅ Require status checks to pass before merging**
- Required status checks:
  - `security-scan`
  - `code-quality`

**❌ Allow force pushes**: Disabled
**❌ Allow deletions**: Disabled

## Advanced Protection Rules

### Tag Protection

Protect version tags from unauthorized changes:

1. Go to **Settings** → **Tags**
2. Click **Add rule**
3. Tag name pattern: `v*`
4. ☑️ Restrict pushes that create this tag
5. ☑️ Restrict pushes that update this tag

### Status Check Configuration

Ensure your GitHub Actions workflows report status correctly by adding these status contexts:

```yaml
# In your workflow files (.github/workflows/*.yml)
name: security-scan  # Must match the required status check
```

### CODEOWNERS File

Create `.github/CODEOWNERS` to automatically assign reviewers:

```
# Global owners
* @your-username @team-lead

# Frontend code
*.html @frontend-team
*.css @frontend-team
*.js @frontend-team

# Backend/Database
supabase/ @backend-team
*.sql @backend-team

# CI/CD
.github/ @devops-team
*.yml @devops-team
*.yaml @devops-team

# Documentation
*.md @documentation-team
docs/ @documentation-team

# Security-sensitive files
SECURITY.md @security-team
package.json @security-team
package-lock.json @security-team
```

## Emergency Procedures

### Bypass Protection (Emergency Only)

In critical situations, administrators can temporarily disable protection:

1. Go to **Settings** → **Branches**
2. Find the protection rule
3. Click **Edit**
4. Temporarily uncheck **Include administrators**
5. Make emergency changes
6. **Immediately re-enable protection**

### Hot Fix Process

For critical production fixes:

1. Create hotfix branch from `main`
2. Make minimal necessary changes
3. Create PR with `HOTFIX:` prefix
4. Get expedited review (single reviewer acceptable)
5. Merge to `main` immediately
6. Cherry-pick to `develop`

## Validation and Testing

### Test Branch Protection

1. **Try direct push to main**:
   ```bash
   git checkout main
   echo "test" > test.txt
   git add test.txt
   git commit -m "test"
   git push origin main
   ```
   Should be **rejected**.

2. **Try PR without reviews**:
   - Create feature branch
   - Make changes and create PR to main
   - Try to merge without approval
   Should be **blocked**.

3. **Try PR with failing checks**:
   - Create PR that fails tests
   - Try to merge
   Should be **blocked**.

### Verify Status Checks

Ensure all required status checks are working:

1. Create a test PR
2. Verify all required checks run
3. Confirm they report status to GitHub
4. Test both passing and failing scenarios

## Common Issues and Solutions

### ❌ Status Check Not Found

**Problem**: Required status check doesn't appear
**Solution**: 
- Ensure workflow name matches exactly
- Check workflow triggers include PR events
- Verify workflow runs on correct branches

### ❌ Can't Merge PR

**Problem**: Merge button is disabled
**Solutions**:
- Check all required status checks pass
- Ensure sufficient approvals
- Verify conversations are resolved
- Check branch is up to date

### ❌ Administrator Override Not Working

**Problem**: Admin can't bypass protection
**Solutions**:
- Ensure "Include administrators" is unchecked
- Check user has admin permissions
- Verify repository permissions

### ❌ Reviews Dismissed Unexpectedly

**Problem**: Approvals disappear after new commits
**Solutions**:
- This is expected behavior when "Dismiss stale reviews" is enabled
- Request fresh reviews after changes
- Consider disabling stale review dismissal if inappropriate

## Monitoring and Maintenance

### Regular Reviews

Monthly checks:
- ✅ Review protection rule effectiveness
- ✅ Audit bypass activities
- ✅ Update required status checks
- ✅ Review CODEOWNERS assignments

### Metrics to Track

- 📊 Pull request merge time
- 📊 Number of protection bypasses
- 📊 Failed status checks
- 📊 Review participation rates

### Team Training

Ensure team understands:
- 📚 Why protection rules exist
- 📚 How to work with protected branches
- 📚 Emergency procedures
- 📚 Code review best practices

## Branch Protection Checklist

Use this checklist to verify your setup:

### Main Branch ✅
- [ ] Requires 2 approvals
- [ ] Requires all status checks
- [ ] Dismisses stale reviews
- [ ] Requires conversation resolution
- [ ] Includes administrators
- [ ] Disallows force pushes
- [ ] Disallows deletions

### Develop Branch ✅
- [ ] Requires 1 approval
- [ ] Requires key status checks
- [ ] Allows admin emergency access
- [ ] Disallows force pushes
- [ ] Disallows deletions

### CODEOWNERS ✅
- [ ] File exists in `.github/CODEOWNERS`
- [ ] Covers all important file types
- [ ] Assigns appropriate reviewers
- [ ] Includes security-sensitive files

### Testing ✅
- [ ] Direct push to main blocked
- [ ] PR merge blocked without approval
- [ ] PR merge blocked with failing checks
- [ ] Status checks report correctly

This protection setup ensures your HOSTALL project maintains high code quality while allowing efficient development workflows.