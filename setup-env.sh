#!/bin/bash

echo "Setting up environment variables for SaaS Boilerplate..."

# Create .env file in root
cat > .env << EOF
# ========================================
# SaaS Boilerplate Environment Configuration
# ========================================

# ========================================
# DATABASE CONFIGURATION
# ========================================
DATABASE_URL="postgresql://postgres@localhost:5432/saas_boilerplate"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
DATABASE_NAME="saas_boilerplate"
DATABASE_USER="postgres"
DATABASE_PASSWORD=""

# ========================================
# NEXT.JS & NEXT-AUTH CONFIGURATION
# ========================================
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
NEXTAUTH_URL_INTERNAL="http://localhost:3001"

# ========================================
# EMAIL & NOTIFICATIONS
# ========================================
# Resend API Key (you provided: 4b39196640c581dde041912433476c2c)
EMAIL_API_KEY="4b39196640c581dde041912433476c2c"
RESEND_API_KEY="4b39196640c581dde041912433476c2c"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# ========================================
# APP CONFIGURATION
# ========================================
NEXT_PUBLIC_APP_NAME="SaaS Boilerplate"
NEXT_PUBLIC_APP_DOMAIN="localhost"
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# ========================================
# SECURITY & ENCRYPTION
# ========================================
ENCRYPTION_SECRET="your-32-character-encryption-key-change-this"
EOF

# Create .env file in web app
cat > apps/web/.env << EOF
# ========================================
# Web App Environment Configuration
# ========================================

# ========================================
# DATABASE CONFIGURATION
# ========================================
DATABASE_URL="postgresql://postgres@localhost:5432/saas_boilerplate"

# ========================================
# NEXT.JS & NEXT-AUTH CONFIGURATION
# ========================================
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

# ========================================
# EMAIL & NOTIFICATIONS
# ========================================
# Resend API Key (you provided: 4b39196640c581dde041912433476c2c)
EMAIL_API_KEY="4b39196640c581dde041912433476c2c"
RESEND_API_KEY="4b39196640c581dde041912433476c2c"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# ========================================
# APP CONFIGURATION
# ========================================
NEXT_PUBLIC_APP_NAME="SaaS Boilerplate"
NEXT_PUBLIC_APP_DOMAIN="localhost"
NEXT_PUBLIC_APP_URL="http://localhost:3001"

# ========================================
# SECURITY & ENCRYPTION
# ========================================
ENCRYPTION_SECRET="your-32-character-encryption-key-change-this"
EOF

# Create .env file in db package
cat > packages/@acmecorp/db/.env << EOF
# ========================================
# Database Environment Configuration
# ========================================
DATABASE_URL="postgresql://postgres@localhost:5432/saas_boilerplate"
EOF

echo "Environment files created successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure PostgreSQL is running"
echo "2. Create the database: createdb saas_boilerplate"
echo "3. Run database migration: pnpm db:migrate"
echo "4. Start the development server: pnpm dev"
echo ""
echo "Note: The EMAIL_API_KEY is set to your provided key: 4b39196640c581dde041912433476c2c"
echo "If you need to use a different email service, update the EMAIL_API_KEY in the .env files."
