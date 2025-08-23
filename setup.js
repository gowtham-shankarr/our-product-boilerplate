#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function replaceInFile(filePath, searchValue, replaceValue) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const originalContent = content;

    // Replace all occurrences
    content = content.replace(new RegExp(searchValue, "g"), replaceValue);

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      log(`✅ Updated: ${filePath}`, "green");
      return true;
    }
    return false;
  } catch (error) {
    log(`❌ Error updating ${filePath}: ${error.message}`, "red");
    return false;
  }
}

function updatePackageJson(packagePath, updates) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    Object.keys(updates).forEach((key) => {
      if (typeof updates[key] === "object" && packageJson[key]) {
        packageJson[key] = { ...packageJson[key], ...updates[key] };
      } else {
        packageJson[key] = updates[key];
      }
    });

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
    log(`✅ Updated: ${packagePath}`, "green");
    return true;
  } catch (error) {
    log(`❌ Error updating ${packagePath}: ${error.message}`, "red");
    return false;
  }
}

function renameDirectory(oldPath, newPath) {
  try {
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      log(`✅ Renamed: ${oldPath} → ${newPath}`, "green");
      return true;
    }
    return false;
  } catch (error) {
    log(`❌ Error renaming ${oldPath}: ${error.message}`, "red");
    return false;
  }
}

async function main() {
  log("\n🚀 SaaS Boilerplate Setup Script", "bright");
  log("=====================================\n", "cyan");

  // Get configuration from user
  log("📝 Configuration Setup", "yellow");
  log("----------------------\n", "cyan");

  const productName = await question(
    'Enter your product name (e.g., "MySaaS"): '
  );
  const productSlug = productName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const packageName = `@${productSlug}`;

  const domain = await question('Enter your domain (e.g., "mysaas.com"): ');
  const databaseName = await question(
    'Enter database name (e.g., "mysaas_db"): '
  );

  const googleClientId = await question(
    "Enter Google OAuth Client ID (or press Enter to skip): "
  );
  const googleClientSecret = await question(
    "Enter Google OAuth Client Secret (or press Enter to skip): "
  );

  const githubClientId = await question(
    "Enter GitHub OAuth Client ID (or press Enter to skip): "
  );
  const githubClientSecret = await question(
    "Enter GitHub OAuth Client Secret (or press Enter to skip): "
  );

  const stripePublishableKey = await question(
    "Enter Stripe Publishable Key (or press Enter to skip): "
  );
  const stripeSecretKey = await question(
    "Enter Stripe Secret Key (or press Enter to skip): "
  );

  const sendgridApiKey = await question(
    "Enter SendGrid API Key (or press Enter to skip): "
  );

  log("\n🔄 Starting Configuration...\n", "yellow");

  // 1. Update package names and references
  log("📦 Updating package names and references...", "blue");

  const filesToUpdate = [
    "package.json",
    "apps/web/package.json",
    "packages/@acmecorp/router/package.json",
    "packages/@acmecorp/api/package.json",
    "packages/@acmecorp/auth/package.json",
    "packages/@acmecorp/orgs/package.json",
    "turbo.json",
    "pnpm-workspace.yaml",
  ];

  filesToUpdate.forEach((file) => {
    if (fs.existsSync(file)) {
      replaceInFile(file, "@acmecorp", packageName);
      replaceInFile(file, "acmecorp", productSlug);
    }
  });

  // 2. Rename package directories
  log("\n📁 Renaming package directories...", "blue");

  const packagesToRename = [
    "packages/@acmecorp/router",
    "packages/@acmecorp/api",
    "packages/@acmecorp/auth",
    "packages/@acmecorp/orgs",
  ];

  packagesToRename.forEach((oldPath) => {
    const newPath = oldPath.replace("@acmecorp", packageName);
    renameDirectory(oldPath, newPath);
  });

  // 3. Update import statements in code files
  log("\n🔧 Updating import statements...", "blue");

  const codeFiles = [
    "apps/web/src/lib/routes.ts",
    "apps/web/src/lib/api.ts",
    "apps/web/src/app/demo/routing/page.tsx",
    "apps/web/src/app/demo/api/page.tsx",
    "apps/web/src/app/demo/auth/page.tsx",
    "apps/web/src/app/demo/organizations/page.tsx",
  ];

  codeFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      replaceInFile(file, "@acmecorp", packageName);
    }
  });

  // 4. Update environment variables
  log("\n🔐 Setting up environment variables...", "blue");

  const envContent = `# ========================================
# ${productName} Environment Configuration
# ========================================

# ========================================
# DATABASE CONFIGURATION
# ========================================
DATABASE_URL="postgresql://username:password@localhost:5432/${databaseName}"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
DATABASE_NAME="${databaseName}"
DATABASE_USER="username"
DATABASE_PASSWORD="password"

# ========================================
# NEXT.JS & NEXT-AUTH CONFIGURATION
# ========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${Math.random().toString(36).substring(2, 15)}"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"

# ========================================
# OAUTH PROVIDERS
# ========================================
# Google OAuth
${googleClientId ? `GOOGLE_CLIENT_ID="${googleClientId}"` : "# GOOGLE_CLIENT_ID="}
${googleClientSecret ? `GOOGLE_CLIENT_SECRET="${googleClientSecret}"` : "# GOOGLE_CLIENT_SECRET="}

# GitHub OAuth
${githubClientId ? `GITHUB_CLIENT_ID="${githubClientId}"` : "# GITHUB_CLIENT_ID="}
${githubClientSecret ? `GITHUB_CLIENT_SECRET="${githubClientSecret}"` : "# GITHUB_CLIENT_SECRET="}

# ========================================
# PAYMENT & BILLING (STRIPE)
# ========================================
${stripePublishableKey ? `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${stripePublishableKey}"` : "# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="}
${stripeSecretKey ? `STRIPE_SECRET_KEY="${stripeSecretKey}"` : "# STRIPE_SECRET_KEY="}
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID=""
STRIPE_CUSTOMER_PORTAL_URL=""

# ========================================
# EMAIL & NOTIFICATIONS
# ========================================
# SendGrid
${sendgridApiKey ? `SENDGRID_API_KEY="${sendgridApiKey}"` : "# SENDGRID_API_KEY="}
SENDGRID_FROM_EMAIL="noreply@${domain}"
SENDGRID_FROM_NAME="${productName}"

# Resend (Alternative)
# RESEND_API_KEY=""
# RESEND_FROM_EMAIL="noreply@${domain}"

# ========================================
# APP CONFIGURATION
# ========================================
NEXT_PUBLIC_APP_NAME="${productName}"
NEXT_PUBLIC_APP_DOMAIN="${domain}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_DESCRIPTION="${productName} - Your SaaS Solution"

# ========================================
# SECURITY & ENCRYPTION
# ========================================
ENCRYPTION_KEY="${Math.random().toString(36).substring(2, 15)}"
JWT_SECRET="${Math.random().toString(36).substring(2, 15)}"
COOKIE_SECRET="${Math.random().toString(36).substring(2, 15)}"

# ========================================
# MONITORING & ANALYTICS
# ========================================
# Sentry
# SENTRY_DSN=""
# SENTRY_ORG=""
# SENTRY_PROJECT=""

# Google Analytics
# NEXT_PUBLIC_GA_ID=""
# NEXT_PUBLIC_GA_MEASUREMENT_ID=""

# Mixpanel
# NEXT_PUBLIC_MIXPANEL_TOKEN=""

# ========================================
# STORAGE & CDN
# ========================================
# AWS S3
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_REGION="us-east-1"
# AWS_S3_BUCKET=""
# AWS_S3_BUCKET_REGION="us-east-1"

# Cloudinary
# CLOUDINARY_CLOUD_NAME=""
# CLOUDINARY_API_KEY=""
# CLOUDINARY_API_SECRET=""

# ========================================
# EXTERNAL SERVICES
# ========================================
# Redis (for caching/sessions)
# REDIS_URL="redis://localhost:6379"
# REDIS_HOST="localhost"
# REDIS_PORT="6379"
# REDIS_PASSWORD=""

# SMTP (for email)
# SMTP_HOST=""
# SMTP_PORT="587"
# SMTP_USER=""
# SMTP_PASS=""
# SMTP_FROM="noreply@${domain}"

# ========================================
# DEVELOPMENT & DEBUGGING
# ========================================
NODE_ENV="development"
NEXT_PUBLIC_DEBUG="true"
NEXT_PUBLIC_LOG_LEVEL="debug"

# ========================================
# FEATURE FLAGS
# ========================================
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
NEXT_PUBLIC_ENABLE_BILLING="false"
NEXT_PUBLIC_ENABLE_ORGANIZATIONS="true"
NEXT_PUBLIC_ENABLE_TEAMS="true"
NEXT_PUBLIC_ENABLE_INVITATIONS="true"

# ========================================
# RATE LIMITING
# ========================================
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW_MS="900000"

# ========================================
# CORS & SECURITY
# ========================================
CORS_ORIGIN="http://localhost:3000"
NEXT_PUBLIC_ALLOWED_ORIGINS="http://localhost:3000,https://${domain}"

# ========================================
# SUBDOMAIN CONFIGURATION
# ========================================
NEXT_PUBLIC_SUBDOMAIN_ENABLED="false"
NEXT_PUBLIC_SUBDOMAIN_PATTERN="org"
NEXT_PUBLIC_ROOT_DOMAIN="${domain}"

# ========================================
# API CONFIGURATION
# ========================================
API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
API_TIMEOUT="30000"
API_RETRY_ATTEMPTS="3"

# ========================================
# CACHE CONFIGURATION
# ========================================
CACHE_TTL="3600"
CACHE_MAX_SIZE="100"
NEXT_PUBLIC_CACHE_ENABLED="true"

# ========================================
# LOGGING
# ========================================
LOG_LEVEL="info"
LOG_FORMAT="json"
LOG_FILE="logs/app.log"

# ========================================
# BACKUP & MAINTENANCE
# ========================================
BACKUP_ENABLED="false"
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS="30"

# ========================================
# WEBHOOKS
# ========================================
WEBHOOK_SECRET="${Math.random().toString(36).substring(2, 15)}"
WEBHOOK_ENDPOINT="https://${domain}/api/webhooks"

# ========================================
# INTEGRATIONS
# ========================================
# Slack
# SLACK_BOT_TOKEN=""
# SLACK_SIGNING_SECRET=""
# SLACK_WEBHOOK_URL=""

# Discord
# DISCORD_WEBHOOK_URL=""

# Zapier
# ZAPIER_WEBHOOK_URL=""

# ========================================
# TESTING
# ========================================
# Test Database
TEST_DATABASE_URL="postgresql://username:password@localhost:5432/${databaseName}_test"

# Test API Keys
# TEST_STRIPE_SECRET_KEY=""
# TEST_SENDGRID_API_KEY=""

# ========================================
# DEPLOYMENT
# ========================================
# Vercel
# VERCEL_URL=""
# VERCEL_GIT_COMMIT_SHA=""

# Railway
# RAILWAY_STATIC_URL=""

# Netlify
# NETLIFY_URL=""

# ========================================
# CUSTOM CONFIGURATION
# ========================================
# Add your custom environment variables below
# CUSTOM_API_KEY=""
# CUSTOM_SERVICE_URL=""
`;

  fs.writeFileSync(".env.local", envContent);
  log("✅ Created: .env.local", "green");

  // 5. Update app metadata
  log("\n📱 Updating app metadata...", "blue");

  const appFiles = [
    "apps/web/src/app/layout.tsx",
    "apps/web/next.config.js",
    "apps/web/package.json",
  ];

  appFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      replaceInFile(file, "SaaS Toolkit", productName);
      replaceInFile(
        file,
        "A comprehensive SaaS application",
        `${productName} - Your SaaS Solution`
      );
    }
  });

  // 6. Update README
  log("\n📖 Updating documentation...", "blue");

  const readmeContent = `# ${productName}

A modern SaaS application built with Next.js, TypeScript, and modern tooling.

## Features

- 🚀 **Next.js 14** with App Router
- 🔒 **Authentication** with NextAuth.js
- 🎯 **Type-safe API** with Zod validation
- 🏢 **Organization Management**
- 🎨 **Modern UI** with Tailwind CSS
- 📦 **Monorepo** with pnpm workspaces
- ⚡ **Fast builds** with Turbo

## Quick Start

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

3. Start development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── ${packageName}/router/    # Type-safe routing
│   ├── ${packageName}/api/       # API client & contracts
│   ├── ${packageName}/auth/      # Authentication
│   └── ${packageName}/orgs/      # Organization management
└── docs/                    # Documentation
\`\`\`

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL
- **Monorepo**: pnpm + Turbo
- **Validation**: Zod
- **State Management**: React Query

## License

MIT
`;

  fs.writeFileSync("README.md", readmeContent);
  log("✅ Updated: README.md", "green");

  // 7. Create setup completion script
  log("\n🎯 Creating setup completion script...", "blue");

  const setupCompleteScript = `#!/bin/bash

echo "🎉 ${productName} Setup Complete!"
echo "================================"
echo ""
echo "✅ Package names updated to: ${packageName}"
echo "✅ Database configured: ${databaseName}"
echo "✅ Domain set to: ${domain}"
echo "✅ Environment variables configured"
echo ""
echo "🚀 Next steps:"
echo "1. Install dependencies: pnpm install"
echo "2. Set up your database"
echo "3. Configure your OAuth providers"
echo "4. Start development: pnpm dev"
echo ""
echo "📚 Documentation: README.md"
echo "🔧 Configuration: .env.local"
`;

  fs.writeFileSync("setup-complete.sh", setupCompleteScript);
  fs.chmodSync("setup-complete.sh", "755");
  log("✅ Created: setup-complete.sh", "green");

  // 8. Final summary
  log("\n🎉 Setup Complete!", "green");
  log("==================\n", "cyan");

  log(`✅ Product Name: ${productName}`, "green");
  log(`✅ Package Name: ${packageName}`, "green");
  log(`✅ Domain: ${domain}`, "green");
  log(`✅ Database: ${databaseName}`, "green");
  log(`✅ Environment: .env.local created`, "green");
  log(`✅ Documentation: README.md updated`, "green");

  log("\n🚀 Next Steps:", "yellow");
  log("1. Run: pnpm install", "cyan");
  log("2. Set up your database", "cyan");
  log("3. Configure OAuth providers in .env.local", "cyan");
  log("4. Start development: pnpm dev", "cyan");

  log("\n📚 Check README.md for detailed instructions", "blue");
  log("🔧 Review .env.local for configuration options", "blue");

  rl.close();
}

// Handle errors
process.on("uncaughtException", (error) => {
  log(`\n❌ Setup failed: ${error.message}`, "red");
  process.exit(1);
});

// Run the setup
main().catch((error) => {
  log(`\n❌ Setup failed: ${error.message}`, "red");
  process.exit(1);
});
