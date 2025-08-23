# 🚀 Vercel Deployment Guide

This guide will help you deploy your SaaS Toolkit monorepo to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, Bitbucket)
3. **Database**: Set up a PostgreSQL database (recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

## 🎯 Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**:

   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: pnpm build
   Output Directory: .next
   Install Command: cd ../.. && pnpm install
   ```

   **⚠️ IMPORTANT**: Make sure to set the Root Directory to `apps/web` - this is crucial!

3. **Environment Variables**:

   ```
   DATABASE_URL=your_postgres_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Deploy**: Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: saas-toolkit
# - In which directory is your code located: ./
# - Want to override the settings: Yes
# - Build Command: pnpm build
# - Output Directory: apps/web/.next
# - Install Command: pnpm install
# - Development Command: pnpm dev
```

## ⚙️ Configuration Files

### vercel.json

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### Environment Variables

Set these in your Vercel project settings:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)

1. **Create Database**:
   - Go to Vercel Dashboard → Storage → Create Database
   - Choose "Postgres"
   - Select your project
   - Create database

2. **Get Connection String**:
   - Copy the connection string from Vercel
   - Add to environment variables as `DATABASE_URL`

3. **Run Migrations**:
   ```bash
   # Add this to your build command or run manually
   pnpm db:generate
   pnpm db:migrate
   ```

### Option 2: External PostgreSQL

- **Supabase**: [supabase.com](https://supabase.com)
- **Neon**: [neon.tech](https://neon.tech)
- **Railway**: [railway.app](https://railway.app)

## 🔧 Build Configuration

### Root package.json

Ensure your build script is:

```json
{
  "scripts": {
    "build": "turbo run build",
    "vercel-build": "turbo run build"
  }
}
```

### Turborepo Configuration

Your `turbo.json` should include:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    }
  }
}
```

## 🚀 Deployment Steps

### 1. Prepare Your Repository

```bash
# Ensure everything builds locally
pnpm install
pnpm build
pnpm typecheck

# Commit all changes
git add .
git commit -m "Prepare for deployment"
git push
```

### 2. Deploy to Vercel

1. **Connect Repository** in Vercel Dashboard
2. **Configure Build Settings**:
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm build`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`

3. **Set Environment Variables**:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. **Deploy**

### 3. Post-Deployment

```bash
# Run database migrations
pnpm db:migrate

# Seed database (if needed)
pnpm db:seed
```

## 🔍 Troubleshooting

### Build Errors

**Issue**: "Cannot find module '@acmecorp/ui'"
**Solution**: Ensure all packages are built before app builds

**Issue**: "Prisma Client not generated"
**Solution**: Add `pnpm db:generate` to build command

**Issue**: "No Output Directory named 'public' found"
**Solution**: Make sure you're building the web app, not the admin app. Set root directory to `apps/web`

**Issue**: "Build failed - wrong app detected"
**Solution**: Use the deployment script: `./deploy.sh` or manually set root directory to `apps/web`

**Issue**: "No Next.js version detected"
**Solution**: Make sure Root Directory is set to `apps/web` in Vercel project settings

### Runtime Errors

**Issue**: "Database connection failed"
**Solution**: Check `DATABASE_URL` environment variable

**Issue**: "Authentication not working"
**Solution**: Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

### Performance Issues

**Issue**: "Slow builds"
**Solution**: Enable Vercel's build cache and Turborepo remote caching

## 📊 Monitoring

### Vercel Analytics

- Enable Vercel Analytics in project settings
- Monitor performance and errors

### Database Monitoring

- Use Vercel Postgres dashboard
- Monitor query performance

### Error Tracking

- Set up error tracking (Sentry, LogRocket)
- Monitor application errors

## 🔄 Continuous Deployment

### Automatic Deployments

- Push to `main` branch triggers deployment
- Preview deployments for pull requests

### Environment Management

- Production: `main` branch
- Staging: `staging` branch
- Development: `develop` branch

## 🛡️ Security

### Environment Variables

- Never commit secrets to Git
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### Database Security

- Use connection pooling
- Enable SSL connections
- Regular backups

### Authentication

- Use strong `NEXTAUTH_SECRET`
- Enable HTTPS only
- Implement rate limiting

## 📈 Scaling

### Performance Optimization

- Enable Vercel's Edge Network
- Use Next.js Image optimization
- Implement caching strategies

### Database Scaling

- Monitor database performance
- Consider read replicas
- Implement connection pooling

## 🎉 Success!

Your SaaS Toolkit is now deployed and ready for production!

**Next Steps**:

1. Set up custom domain
2. Configure monitoring
3. Set up CI/CD pipelines
4. Implement backup strategies

---

**Need Help?**

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
