# Git Branch Strategy for HOSTALL

This document outlines the branching strategy and development workflow for the HOSTALL project.

## Branch Structure

### Main Branches

#### `main` (Production)
- **Purpose**: Production-ready code
- **Protection**: Highly protected, requires PR reviews
- **Deployment**: Automatically deploys to production
- **Merge Policy**: Only from `develop` via Pull Request
- **Required Checks**: All tests, security scans, code review approval

#### `develop` (Integration)
- **Purpose**: Integration branch for ongoing development
- **Protection**: Protected, requires PR reviews
- **Deployment**: Automatically deploys to staging environment
- **Merge Policy**: Feature branches merge here first
- **Testing**: Comprehensive testing environment

### Supporting Branches

#### Feature Branches (`feature/*`)
- **Naming**: `feature/description-of-feature`
- **Purpose**: New features and enhancements
- **Lifetime**: Created from `develop`, merged back to `develop`
- **Examples**:
  - `feature/user-authentication`
  - `feature/hostel-search-filters`
  - `feature/payment-integration`

#### Hotfix Branches (`hotfix/*`)
- **Naming**: `hotfix/description-of-fix`
- **Purpose**: Critical production fixes
- **Lifetime**: Created from `main`, merged to both `main` and `develop`
- **Examples**:
  - `hotfix/security-vulnerability`
  - `hotfix/critical-bug-fix`

#### Release Branches (`release/*`)
- **Naming**: `release/version-number`
- **Purpose**: Prepare releases, final testing and bug fixes
- **Lifetime**: Created from `develop`, merged to `main` and `develop`
- **Examples**:
  - `release/v1.2.0`
  - `release/v2.0.0`

#### Bugfix Branches (`bugfix/*`)
- **Naming**: `bugfix/description-of-bug`
- **Purpose**: Non-critical bug fixes
- **Lifetime**: Created from `develop`, merged back to `develop`
- **Examples**:
  - `bugfix/login-validation-error`
  - `bugfix/ui-alignment-issue`

## Workflow Process

### 1. Feature Development

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-awesome-feature

# Work on feature
git add .
git commit -m "Add new awesome feature functionality"
git push origin feature/new-awesome-feature

# Create Pull Request to develop
# After approval and merge, delete feature branch
git checkout develop
git pull origin develop
git branch -d feature/new-awesome-feature
```

### 2. Release Process

```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Final testing and bug fixes
git commit -m "Prepare release v1.1.0"
git push origin release/v1.1.0

# Create PR to main for release
# After merge, tag the release
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

### 3. Hotfix Process

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Fix the issue
git commit -m "Fix critical security vulnerability"
git push origin hotfix/critical-security-fix

# Create PR to main
# After merge, also merge to develop
git checkout develop
git merge main
git push origin develop
```

## Branch Protection Rules

### Main Branch Protection
- Require pull request reviews (2 reviewers)
- Require status checks to pass
- Require branches to be up to date
- Include administrators in restrictions
- Allow force pushes: ❌
- Allow deletions: ❌

### Develop Branch Protection
- Require pull request reviews (1 reviewer)
- Require status checks to pass
- Require branches to be up to date
- Allow force pushes: ❌
- Allow deletions: ❌

### Required Status Checks
- ✅ Security vulnerability scan
- ✅ Code quality analysis
- ✅ Accessibility testing
- ✅ Performance testing
- ✅ Build successful

## Automated Workflows

### On Feature Branches
- **Triggers**: Push to `feature/*`
- **Actions**: 
  - Run tests and security scans
  - Code quality analysis
  - Generate preview deployment (optional)

### On Develop Branch
- **Triggers**: Push to `develop`
- **Actions**:
  - Full test suite
  - Deploy to staging environment
  - Update staging database
  - Notify team of deployment

### On Main Branch
- **Triggers**: Push to `main`
- **Actions**:
  - Deploy to production
  - Create GitHub release
  - Run post-deployment verification
  - Send success notifications

### On Pull Requests
- **Triggers**: PR to `main` or `develop`
- **Actions**:
  - Run comprehensive tests
  - Security analysis
  - Performance testing
  - Generate preview deployment
  - Accessibility audit

## Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

### Examples
```bash
feat(auth): add two-factor authentication
fix(ui): resolve mobile navigation alignment issue
docs: update deployment instructions
style: format code according to prettier rules
refactor(api): optimize database queries
perf: reduce bundle size by lazy loading components
test: add unit tests for user registration
chore: update dependencies to latest versions
```

## Environment Strategy

### Development
- **Branch**: `feature/*`, `bugfix/*`
- **Database**: Local/development Supabase project
- **Domain**: `localhost:3000`
- **Analytics**: Disabled or test tracking ID

### Staging
- **Branch**: `develop`
- **Database**: Staging Supabase project
- **Domain**: `hostall-staging.pages.dev`
- **Analytics**: Staging tracking ID

### Production
- **Branch**: `main`
- **Database**: Production Supabase project
- **Domain**: `hostall.pages.dev` or custom domain
- **Analytics**: Production tracking ID (G-0NNWGNQE5Q)

## Code Review Guidelines

### For Reviewers
- Check code quality and maintainability
- Verify security best practices
- Test functionality locally if needed
- Ensure documentation is updated
- Verify no sensitive data is committed

### For Authors
- Keep PRs focused and reasonably sized
- Write clear PR descriptions
- Include screenshots for UI changes
- Add or update tests as needed
- Ensure CI checks pass before requesting review

## Emergency Procedures

### Production Hotfix
1. Create hotfix branch from `main`
2. Fix the critical issue
3. Test thoroughly
4. Create PR to `main` with "HOTFIX" label
5. Fast-track review process
6. Deploy immediately after merge
7. Monitor production closely
8. Merge back to `develop`

### Rollback Procedure
1. Identify the problematic commit
2. Create rollback PR to `main`
3. Deploy previous stable version
4. Investigate and fix root cause
5. Re-deploy fixed version

This branching strategy ensures code quality, enables parallel development, and maintains stability across all environments.