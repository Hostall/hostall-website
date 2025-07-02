# HOSTALL - Hostel Management Website

## Overview
HOSTALL is a hostel listing and management platform built as a single-page application with Supabase backend integration. The website allows users to browse hostels and provides an admin dashboard for managing listings and users.

## Architecture
- **Frontend**: Single HTML file with embedded CSS and JavaScript
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **Data Storage**: Supabase with localStorage fallback
- **Structure**: Section-based navigation with show/hide functionality
- **Admin System**: Supabase-based authentication with role management
- **Security**: Comprehensive protection against XSS, CSRF, SQL injection, and data leaks

## Recent Updates (2025-06-30)
1. ✅ **Google Analytics Integration** - Added tracking code G-0NNWGNQE5Q
2. ✅ **Other Facilities Field** - Added custom facilities textarea in hostel form
3. ✅ **Unsplash Image Search** - Integrated image search for hostel media
4. ✅ **Google Maps Integration** - Enhanced map display and interaction
5. ✅ **Email Validation** - Added proper email format validation
6. ✅ **Phone Number Formatting** - Pakistani format (+92-XXX-XXXXXXX)
7. ✅ **Enhanced Hostel Details Display** - Shows other facilities and improved map integration
8. ✅ **Advanced Security Implementation** - Protection against hackers and data leaks
9. ✅ **Deployment Automation** - GitHub Actions + Cloudflare Pages setup
10. ✅ **Supabase Edge Functions** - Automated sync, backup, and scheduled tasks
11. ✅ **Two-Factor Authentication** - TOTP-based 2FA with recovery codes
12. ✅ **Email/SMS Notification System** - Comprehensive security event notifications
13. ✅ **Enhanced MCP Tool Integrations** - Advanced hostel details and about us sections

## Key Features
1. **Public Hostel Listings**: Displays featured hostels with images and basic info
2. **Admin Dashboard**: Hostel management and admin user management
3. **Supabase Integration**: Real-time data synchronization
4. **File Upload**: Image upload with Unsplash integration
5. **Authentication**: Supabase-based admin login system with 2FA
6. **Chat Interface**: Fixed chat widget with WhatsApp integration
7. **Google Maps**: Interactive map display for hostel locations
8. **Facilities Management**: Comprehensive facility selection with custom options
9. **Notification System**: Email/SMS alerts for security events
10. **Enhanced MCP Integrations**: Rich hostel details and about us sections

## Data Structure
### Hostels (Supabase table: 'hostels')
```json
{
  "name": "Hostel Name",
  "gender": "Male/Female", 
  "location": "Address/Area",
  "details": "Description, rent, facilities",
  "map": "Google Maps URL",
  "phone": "+92-300-1234567",
  "whatsapp": "+92-300-1234567",
  "img": "base64 image data",
  "facilities": ["wifi", "ac", "security", "laundry"],
  "other_facilities": "Study Room, Prayer Area, etc.",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Admins (Supabase table: 'admins')
```json
{
  "user_email": "admin@example.com",
  "password_hash": "hashed_password",
  "role": "admin|hostel_owner",
  "hostel_id": "assigned_hostel_id",
  "approved": true/false,
  "created_at": "timestamp"
}
```

## Deployment Automation (IMPLEMENTED ✅)

### Current Setup
- **Supabase Project**: teamhostall Project (pjnqhdhlcgrrmfzscswv)
- **Organization**: Teamhostall
- **Region**: ap-south-1 (Mumbai)

### Step 1: GitHub Actions + Cloudflare Pages ✅
**Status**: Fully implemented and configured
- ✅ **GitHub Actions Workflow**: `.github/workflows/deploy.yml`
- ✅ **Automatic Deployment**: Triggers on push to main/master branches
- ✅ **Manual Deployment**: Workflow dispatch support
- ✅ **Security Scanning**: Automated code analysis and auditing
- ✅ **Post-deployment Tasks**: Data backup and sync triggers
- ✅ **Notification System**: Success/failure notifications

**Features Implemented**:
- Node.js 18 environment setup
- Dependency installation and build process
- Security audit integration
- Cloudflare Pages deployment
- Supabase Edge Function triggers
- Automated data backup after deployment
- Comprehensive error handling and notifications

### Step 3: Supabase Edge Functions ✅
**Status**: Three Edge Functions deployed and configured

#### 1. sync-deployment Function ✅
- **Purpose**: Handles post-deployment synchronization
- **Triggers**: GitHub Actions post-deployment
- **Features**:
  - Deployment logging and tracking
  - Cache refresh automation
  - Cleanup of expired data
  - Webhook notifications
  - Performance monitoring

#### 2. backup-data Function ✅
- **Purpose**: Automated data backup and management
- **Triggers**: Scheduled via GitHub Actions
- **Features**:
  - Multi-table backup support
  - Backup verification and logging
  - Old backup cleanup (7-day retention)
  - Backup status notifications
  - Error handling and recovery

#### 3. scheduled-tasks Function ✅
- **Purpose**: Comprehensive automation and monitoring
- **Features**:
  - Daily backup automation
  - Global cache refresh
  - Security audit automation
  - Data cleanup processes
  - Performance monitoring
  - Report generation

### Two-Factor Authentication System ✅
**Status**: Fully implemented and integrated

#### Database Schema ✅
- ✅ **2FA Columns**: Added to admins table (two_factor_secret, two_factor_enabled, etc.)
- ✅ **Recovery Codes Table**: Secure storage for backup codes
- ✅ **Security Events**: Enhanced logging for 2FA activities
- ✅ **Cache Tables**: Performance optimization tables

#### Frontend Implementation ✅
- ✅ **2FA Setup Modal**: QR code generation and verification
- ✅ **Login Flow Integration**: 2FA verification during login
- ✅ **Recovery Code System**: Backup authentication method
- ✅ **Security Dashboard**: Admin interface for 2FA management
- ✅ **Status Monitoring**: Real-time security event tracking

#### Security Features ✅
- ✅ **TOTP Generation**: Time-based one-time passwords
- ✅ **Recovery Codes**: 10 single-use backup codes
- ✅ **Security Event Logging**: Comprehensive audit trail
- ✅ **Failed Attempt Tracking**: Brute force protection
- ✅ **Session Management**: Enhanced security with 2FA

### Email/SMS Notification System ✅
**Status**: Fully implemented and integrated

#### Database Schema ✅
- ✅ **Notification Preferences**: User-configurable email/SMS settings
- ✅ **Notification Logs**: Complete audit trail of sent notifications
- ✅ **Notification Templates**: Customizable email/SMS templates
- ✅ **Notification Queue**: Async processing and retry logic

#### Notification Features ✅
- ✅ **Security Event Alerts**: Failed logins, suspicious activity, account locks
- ✅ **Login Notifications**: New device/location login alerts
- ✅ **Password Reset**: Secure code delivery via email/SMS
- ✅ **Template System**: Rich HTML emails and SMS templates
- ✅ **User Preferences**: Granular control over notification types
- ✅ **Delivery Status**: Tracking and error handling

#### Integration Ready ✅
- ✅ **Email Service Ready**: SendGrid, Mailgun, AWS SES integration points
- ✅ **SMS Service Ready**: Twilio integration points
- ✅ **Notification Manager**: Centralized notification handling
- ✅ **Security Integration**: Automatic notifications on security events

### Enhanced MCP Tool Integrations ✅
**Status**: Fully implemented and integrated

#### Enhanced Hostel Details ✅
- ✅ **Interactive Maps**: Google Maps with nearby places and transportation
- ✅ **Rich Photo Gallery**: Unsplash integration with lightbox viewing
- ✅ **Facilities Showcase**: Icon-based facility display with custom amenities
- ✅ **Contact Integration**: Direct call, WhatsApp, and direction features
- ✅ **Reviews Section**: Placeholder for future review system
- ✅ **Quick Actions**: Call, message, share, and navigation buttons

#### Enhanced About Us Section ✅
- ✅ **Hero Section**: Gradient background with company mission
- ✅ **Mission & Vision**: Professional company value proposition
- ✅ **Team Showcase**: Staff profiles with role descriptions
- ✅ **Statistics Dashboard**: Company metrics and achievements
- ✅ **Timeline**: Company journey and milestones
- ✅ **Contact Integration**: Social media and contact form

#### MCP Tool Features ✅
- ✅ **HugeIcons Integration**: Rich iconography throughout interface
- ✅ **Google Maps API**: Advanced mapping with places and directions
- ✅ **Image Optimization**: Responsive images with lazy loading
- ✅ **Social Sharing**: Native and fallback sharing capabilities
- ✅ **Mobile Optimization**: Responsive design for all screen sizes

### Real-time User Data Synchronization ✅
- **Supabase Realtime**: Automatically syncs data between users
- **No manual updates needed**: Changes appear instantly across all users
- **Conflict Resolution**: Supabase handles concurrent updates
- **Edge Function Sync**: Automated synchronization via deployed functions

## Security Features
### Database Protection
- ✅ **Row Level Security (RLS)** - Enabled on all tables
- ✅ **Data Encryption** - Sensitive fields like phone numbers are encrypted
- ✅ **Access Control** - Role-based permissions for data access
- ✅ **Rate Limiting** - Server-side protection against brute force attacks
- ✅ **Security Event Logging** - Tracks all suspicious activities

### User Authentication Security
- ✅ **Enhanced Password Requirements** - Requires strong passwords
- ✅ **Login Throttling** - Prevents brute force attacks
- ✅ **Account Lockout** - Temporarily locks accounts after multiple failed attempts
- ✅ **Session Management** - Secure session handling with timeouts
- ✅ **CSRF Protection** - Prevents cross-site request forgery

### Web Security
- ✅ **Content Security Policy** - Prevents XSS attacks
- ✅ **Input Sanitization** - Cleanses all user inputs
- ✅ **Security Headers** - X-XSS-Protection, X-Content-Type-Options, etc.
- ✅ **Attack Pattern Detection** - Monitors for suspicious activities
- ✅ **API Key Protection** - Securely handles API credentials

### Two-Factor Authentication
- ✅ **TOTP Support** - Time-based One-Time Password authentication
- ✅ **QR Code Setup** - Easy setup with authenticator apps
- ✅ **Recovery Codes** - 10 single-use backup codes for account recovery
- ✅ **Security Dashboard** - Real-time monitoring and management
- ✅ **Event Logging** - Comprehensive audit trail for 2FA activities

## Integration Status
- ✅ Google Analytics (G-0NNWGNQE5Q)
- ✅ Supabase Backend with comprehensive database schema
- ✅ Unsplash Image Search with gallery integration
- ✅ Google Maps Integration with advanced features
- ✅ Phone/Email Validation with Pakistani formatting
- ✅ Advanced Security Implementation with XSS/CSRF protection
- ✅ Cloudflare Deployment Automation (GitHub Actions + Edge Functions)
- ✅ Two-Factor Authentication (TOTP + Recovery Codes)
- ✅ Email/SMS Notification System (Ready for service integration)
- ✅ Enhanced MCP Tool Integrations (HugeIcons, Maps, Images)
- ✅ Automated Backup System with data retention
- ✅ Real-time Security Monitoring with comprehensive logging
- ✅ Performance Optimization (Caching + CDN + Image optimization)

## Development Notes
- All functionality is contained in a single HTML file with external app.js
- Uses Supabase for real-time data synchronization
- Responsive design with modern UI components
- Comprehensive validation and error handling
- Auto-refresh functionality for real-time updates

## Missing Assets
The website references several images that need to be provided:
- `logo.png` - HOSTALL logo
- Hostel images (now can be searched via Unsplash)

This file provides guidance to YOUWARE Agent (youware.com) when working with code in this repository.