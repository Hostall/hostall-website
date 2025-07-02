# HOSTALL - Hostel Management Platform

[![Deployment Status](https://img.shields.io/github/workflow/status/teamhostall/hostall/Deploy%20HOSTALL?label=deployment)](https://github.com/teamhostall/hostall/actions)
[![Security Status](https://img.shields.io/badge/security-RLS%20%2B%202FA-brightgreen)](SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Find the best boys and girls hostels in Lahore with comprehensive search and management features. HOSTALL combines a user-friendly interface with powerful management tools, backed by Supabase and deployed on Cloudflare Pages.

> **Ready for Development**: This repository is configured with GitHub Actions for CI/CD, Supabase Edge Functions for automation, and comprehensive security features including Two-Factor Authentication.

## 🚀 Features

- **Hostel Listings**: Browse verified hostels with detailed information
- **Admin Dashboard**: Comprehensive management system for hostel owners
- **Real-time Updates**: Live data synchronization with Supabase
- **Security First**: Advanced protection against cyber threats
- **Mobile Responsive**: Works perfectly on all devices
- **Google Maps Integration**: Interactive location mapping
- **Image Search**: Unsplash integration for high-quality images

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Cloudflare Pages
- **Maps**: Google Maps API
- **Analytics**: Google Analytics
- **Security**: Multi-layer protection with 2FA

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Supabase      │    │   Cloudflare    │
│   (Static)      │◄──►│   (Backend)      │◄──►│    (CDN)        │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                     │                       │
        │                     │                       │
        ▼                     ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  HTML/CSS/JS    │    │  Edge Functions  │    │  GitHub Actions │
│  User Interface │    │  Automation      │    │  CI/CD Pipeline │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Deployment & Automation

This repository implements a fully automated CI/CD workflow:

1. **GitHub Actions** automatically builds and deploys to Cloudflare Pages
2. **Supabase Edge Functions** handle database operations and scheduled tasks
3. **Two-Factor Authentication** secures admin access with TOTP verification
4. **Automated Backups** protect critical data with scheduled backups

## 🚀 Getting Started

### Repository Setup

This repository is already configured for GitHub Actions CI/CD and Cloudflare deployment. Follow these steps to set up your own instance:

1. **Create your GitHub repository**:
   ```bash
   git clone https://github.com/teamhostall/hostall.git
   cd hostall
   git init
   git add .
   git commit -m "Initial commit: HOSTALL platform"
   git branch -M main
   ```

2. **Connect to your GitHub repository**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hostall.git
   git push -u origin main
   ```

3. **Set up required secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     ```
     CLOUDFLARE_API_TOKEN
     CLOUDFLARE_ACCOUNT_ID
     SUPABASE_URL
     SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     ```

4. **Configure Cloudflare Pages**:
   - See detailed instructions in [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md)

5. **Deploy Edge Functions to Supabase**:
   ```bash
   cd supabase/functions
   supabase functions deploy sync-deployment
   supabase functions deploy backup-data
   supabase functions deploy scheduled-tasks
   ```

For detailed GitHub setup instructions, see [GITHUB_SETUP.md](GITHUB_SETUP.md)

### 💻 Local Development

### Prerequisites
- Node.js 18.x or later
- NPM 8.x or later
- Supabase CLI
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/hostall.git

# Navigate to the project
cd hostall

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

### Supabase Local Development
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Data Encryption**: Sensitive information protection
- **Rate Limiting**: Brute force attack prevention
- **Two-Factor Authentication**: Enhanced admin security
- **Content Security Policy**: XSS attack prevention
- **Security Monitoring**: Real-time threat detection

## 📊 Database Schema

### Hostels Table
```sql
CREATE TABLE hostels (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  location TEXT,
  details TEXT,
  phone TEXT,
  whatsapp TEXT,
  facilities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Admins Table
```sql
CREATE TABLE admins (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'hostel_owner',
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE
);
```

## 🔧 Configuration

### Environment Variables
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public API key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side operations key
- `GOOGLE_MAPS_API_KEY`: Google Maps integration
- `UNSPLASH_ACCESS_KEY`: Image search functionality

### Security Settings
- Session timeout: 2 hours
- Login attempts limit: 5 attempts
- Rate limiting: 60 requests per minute
- CSRF protection: Enabled
- 2FA: Time-based OTP (TOTP)

## 📱 API Endpoints

### Public Endpoints
- `GET /hostels` - List all hostels
- `POST /contact` - Send contact message

### Protected Endpoints (Admin)
- `POST /admin/login` - Admin authentication
- `GET /admin/hostels` - Manage hostels
- `POST /admin/hostels` - Create new hostel
- `PUT /admin/hostels/:id` - Update hostel
- `DELETE /admin/hostels/:id` - Delete hostel

## 🚀 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for speed
- **CDN**: Global content delivery via Cloudflare
- **Caching**: Intelligent caching strategy
- **Image Optimization**: WebP format with fallbacks

## 🛡️ Security Compliance

- **OWASP Top 10**: Protection against common vulnerabilities
- **GDPR Compliant**: Privacy-first data handling
- **Data Encryption**: AES-256 encryption for sensitive data
- **Regular Audits**: Automated security scanning
- **Incident Response**: Comprehensive logging and monitoring

## 📁 Project Structure

```
hostall/
├── .github/                  # GitHub configuration
│   ├── workflows/            # GitHub Actions workflows
│   └── ISSUE_TEMPLATE/       # Issue templates
├── supabase/                 # Supabase configuration
│   ├── functions/            # Edge Functions
│   │   ├── sync-deployment/  # Handles deployment syncing
│   │   ├── backup-data/      # Manages data backups
│   │   └── scheduled-tasks/  # Runs automated tasks
│   └── config.toml           # Supabase configuration
├── app.js                    # Application logic
├── index.html                # Main entry point
├── package.json              # Project dependencies
├── CONTRIBUTING.md           # Contribution guidelines
├── SECURITY.md               # Security policy
└── LICENSE                   # MIT License
```

## 📝 Documentation

- [GitHub Setup Guide](GITHUB_SETUP.md) - Setting up GitHub repository and secrets
- [Cloudflare Setup Guide](CLOUDFLARE_SETUP.md) - Configuring Cloudflare Pages
- [Security Policy](SECURITY.md) - Security features and reporting vulnerabilities
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards

## 📞 Support

For technical support or business inquiries:
- **Email**: support@hostall.com
- **Discord**: [Join our community](https://discord.com/invite/youware)
- **Documentation**: [View full docs](https://docs.hostall.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

## 🔒 Security

For security issues, please read our [Security Policy](SECURITY.md) and report vulnerabilities responsibly.

---

**Built with ❤️ by the HOSTALL Team**