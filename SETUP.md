# 🚀 One-Click SaaS Boilerplate Setup

This script automates the entire setup process for your SaaS boilerplate. Just run one command and everything will be configured!

## 🎯 What the Setup Script Does

The setup script will automatically:

1. **📝 Ask for your product name** and replace all "acmecorp" references
2. **🗄️ Ask for database name** and configure it
3. **🌐 Ask for domain** and set it up
4. **🔐 Ask for API keys** (Google, GitHub, Stripe, SendGrid)
5. **📦 Rename all package directories** to match your product
6. **🔧 Update all import statements** in code files
7. **📄 Create comprehensive environment file** (.env.local) with 50+ variables
8. **📖 Update README** with your product details
9. **✅ Generate setup completion summary**

## 🚀 How to Use

### Option 1: Run the script directly

```bash
node setup.js
```

### Option 2: Run with Node

```bash
./setup.js
```

### Option 3: Run with ES modules (if needed)

```bash
node --experimental-modules setup.js
```

## 📋 What You'll Need

Before running the script, gather these details:

### Required:

- **Product Name** (e.g., "MySaaS", "TaskManager")
- **Domain** (e.g., "mysaas.com", "taskmanager.app")
- **Database Name** (e.g., "mysaas_db", "taskmanager_db")

### Optional (can skip by pressing Enter):

- **Google OAuth** Client ID & Secret
- **GitHub OAuth** Client ID & Secret
- **Stripe** Publishable & Secret Keys
- **SendGrid** API Key

## 🎬 Example Run

```bash
$ node setup.js

🚀 SaaS Boilerplate Setup Script
=====================================

📝 Configuration Setup
----------------------

Enter your product name (e.g., "MySaaS"): TaskManager
Enter your domain (e.g., "mysaas.com"): taskmanager.app
Enter your database name (e.g., "mysaas_db"): taskmanager_db
Enter Google OAuth Client ID (or press Enter to skip):
Enter Google OAuth Client Secret (or press Enter to skip):
Enter GitHub OAuth Client ID (or press Enter to skip):
Enter GitHub OAuth Client Secret (or press Enter to skip):
Enter Stripe Publishable Key (or press Enter to skip):
Enter Stripe Secret Key (or press Enter to skip):
Enter SendGrid API Key (or press Enter to skip):

🔄 Starting Configuration...

📦 Updating package names and references...
✅ Updated: package.json
✅ Updated: apps/web/package.json
✅ Updated: packages/@acmecorp/router/package.json
✅ Updated: packages/@acmecorp/api/package.json
✅ Updated: packages/@acmecorp/auth/package.json
✅ Updated: packages/@acmecorp/orgs/package.json

📁 Renaming package directories...
✅ Renamed: packages/@acmecorp/router → packages/@taskmanager/router
✅ Renamed: packages/@acmecorp/api → packages/@taskmanager/api
✅ Renamed: packages/@acmecorp/auth → packages/@taskmanager/auth
✅ Renamed: packages/@acmecorp/orgs → packages/@taskmanager/orgs

🔧 Updating import statements...
✅ Updated: apps/web/src/lib/routes.ts
✅ Updated: apps/web/src/lib/api.ts
✅ Updated: apps/web/src/app/demo/routing/page.tsx
✅ Updated: apps/web/src/app/demo/api/page.tsx
✅ Updated: apps/web/src/app/demo/auth/page.tsx
✅ Updated: apps/web/src/app/demo/organizations/page.tsx

🔐 Setting up environment variables...
✅ Created: .env.local

📱 Updating app metadata...
✅ Updated: apps/web/src/app/layout.tsx
✅ Updated: apps/web/next.config.js
✅ Updated: apps/web/package.json

📖 Updating documentation...
✅ Updated: README.md

🎯 Creating setup completion script...
✅ Created: setup-complete.sh

🎉 Setup Complete!
==================

✅ Product Name: TaskManager
✅ Package Name: @taskmanager
✅ Domain: taskmanager.app
✅ Database: taskmanager_db
✅ Environment: .env.local created
✅ Documentation: README.md updated

🚀 Next Steps:
1. Run: pnpm install
2. Set up your database
3. Configure OAuth providers in .env.local
4. Start development: pnpm dev

📚 Check README.md for detailed instructions
🔧 Review .env.local for configuration options
```

## ✅ After Setup

Once the script completes:

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up your database:**
   - Create PostgreSQL database with the name you specified
   - Update DATABASE_URL in .env.local if needed

3. **Configure OAuth providers** (if you want authentication):
   - Google: https://console.cloud.google.com/
   - GitHub: https://github.com/settings/developers

4. **Start development:**

   ```bash
   pnpm dev
   ```

5. **Open your app:**
   - http://localhost:3000

## 🔧 What Gets Updated

### Files Updated:

- `package.json` (root and all packages)
- `turbo.json`
- `pnpm-workspace.yaml`
- All TypeScript/JavaScript files with imports
- `apps/web/src/app/layout.tsx`
- `apps/web/next.config.js`
- `README.md`

### Directories Renamed:

- `packages/@acmecorp/*` → `packages/@yourproduct/*`

### Files Created:

- `.env.local` (comprehensive environment variables with 50+ configs)
- `setup-complete.sh` (setup summary)

### Environment Variables Included:

- **Database**: PostgreSQL configuration
- **Authentication**: NextAuth.js setup
- **OAuth**: Google, GitHub providers
- **Payments**: Stripe integration
- **Email**: SendGrid, Resend options
- **Security**: Encryption keys, JWT secrets
- **Monitoring**: Sentry, Google Analytics
- **Storage**: AWS S3, Cloudinary
- **External Services**: Redis, SMTP
- **Feature Flags**: Analytics, billing, organizations
- **Rate Limiting**: API protection
- **CORS & Security**: Cross-origin settings
- **Subdomains**: Organization-based routing
- **API Configuration**: Base URLs, timeouts
- **Caching**: TTL, size limits
- **Logging**: Levels, formats
- **Backup**: Schedules, retention
- **Webhooks**: Secrets, endpoints
- **Integrations**: Slack, Discord, Zapier
- **Testing**: Test database, API keys
- **Deployment**: Vercel, Railway, Netlify

## 🎯 Benefits

- **⚡ One command setup** - No manual file editing
- **🔒 Secure** - Generates secure random secrets
- **📝 Complete** - Updates all references and imports
- **🎨 Professional** - Updates branding and documentation
- **🚀 Ready to use** - Everything configured for development

## 🆘 Troubleshooting

If something goes wrong:

1. **Check file permissions:**

   ```bash
   chmod +x setup.js
   ```

2. **Run with Node explicitly:**

   ```bash
   node setup.js
   ```

3. **Check for existing files:**
   - The script will skip files that don't exist
   - It's safe to run multiple times

4. **Manual cleanup:**
   - If needed, you can manually revert changes
   - All original files are backed up in git

---

**🎉 That's it! One script to rule them all!**
