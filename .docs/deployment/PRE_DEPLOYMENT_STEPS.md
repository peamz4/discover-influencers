# 🚀 Pre-Deployment Steps - Final Checklist

## Overview
This guide will walk you through the exact steps needed to deploy your application to Vercel before submitting.

**Estimated Time**: 30-45 minutes  
**Prerequisites**: Vercel account, GitHub repository access

---

## ⚡ Quick Deployment Path

### Step 1: Verify Local Setup (5 minutes)

#### 1.1 Check All Tests Pass
```powershell
cd apps/api
pnpm test
```
**Expected**: All 34 tests passing ✅

#### 1.2 Verify Environment Files
```powershell
# Check API .env exists
cat apps/api/.env

# Check Web .env.local exists
cat apps/web/.env.local
```

#### 1.3 Run Deployment Checker
```powershell
node check-deployment.js
```
**Expected**: All checks passing (ignore uncommitted changes warning)

---

### Step 2: Prepare Database (10 minutes)

You have 3 options for production database:

#### Option A: Vercel Postgres (Recommended - Easiest)
```powershell
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Create Postgres database
vercel postgres create discover-influencers-db
```

**Copy the DATABASE_URL provided!**

#### Option B: Supabase (Free tier available)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### Option C: Neon (Serverless Postgres)
1. Go to https://neon.tech
2. Create new project
3. Get connection string
4. Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

**⚠️ IMPORTANT**: Save your DATABASE_URL - you'll need it for Vercel environment variables!

---

### Step 3: Prepare Repository (5 minutes)

#### 3.1 Commit All Changes
```powershell
# Check git status
git status

# Add all files
git add .

# Commit with message
git commit -m "feat: production-ready deployment configuration"

# Push to GitHub
git push origin main
```

#### 3.2 Grant Repository Access
1. Go to: https://github.com/peamz4/discover-influencers/settings/access
2. Click "Add people"
3. Enter: `u-primemedia`
4. Select role: "Read"
5. Click "Add u-primemedia to this repository"

---

### Step 4: Deploy API to Vercel (10 minutes)

#### 4.1 Import Project
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose `peamz4/discover-influencers`
4. Click "Import"

#### 4.2 Configure API Deployment
```
Framework Preset: Other
Root Directory: apps/api
Build Command: pnpm vercel-build
Output Directory: dist
Install Command: pnpm install
```

#### 4.3 Add Environment Variables
Click "Environment Variables" and add:

```env
# Database
DATABASE_URL=postgresql://[your_database_url]

# JWT Secrets (generate new ones!)
JWT_SECRET=[generate with: openssl rand -base64 32]
JWT_REFRESH_SECRET=[generate with: openssl rand -base64 32]

# Environment
NODE_ENV=production

# CORS (will update after web deployment)
CORS_ORIGIN=https://your-web-app.vercel.app
```

**Generate Secrets on Windows**:
```powershell
# JWT_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# JWT_REFRESH_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

#### 4.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. **Copy the deployment URL**: `https://discover-influencers-api.vercel.app`

#### 4.5 Verify API Deployment
Test your API:
```powershell
# Health check
curl https://your-api-url.vercel.app/health

# Expected: {"status":"ok"}
```

---

### Step 5: Deploy Web to Vercel (10 minutes)

#### 5.1 Add New Project
1. Go to https://vercel.com/new
2. Select same repository: `peamz4/discover-influencers`
3. Click "Import"

#### 5.2 Configure Web Deployment
```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: (leave default)
Output Directory: (leave default)
Install Command: pnpm install
```

#### 5.3 Add Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app
```

**Replace `your-api-url.vercel.app` with actual API URL from Step 4.4!**

#### 5.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. **Copy the deployment URL**: `https://discover-influencers-web.vercel.app`

---

### Step 6: Update API CORS (5 minutes)

Now that you have the web URL, update API environment variables:

#### 6.1 Update API Environment
1. Go to Vercel Dashboard
2. Select API project
3. Go to Settings > Environment Variables
4. Edit `CORS_ORIGIN`
5. Change to: `https://your-web-url.vercel.app`
6. Click "Save"

#### 6.2 Redeploy API
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for completion

---

### Step 7: Seed Database (5 minutes)

#### 7.1 Connect to Database
```powershell
# Use your DATABASE_URL from Step 2
$env:DATABASE_URL="postgresql://your_database_url"
cd apps/api
```

#### 7.2 Run Migrations
```powershell
npx prisma migrate deploy
```

#### 7.3 Seed Data
```powershell
# Option A: Use TypeScript seed file
npx tsx prisma/seed.ts

# Option B: Use SQL file
# Copy content of data/people_influencers_data.sql
# Execute in your database admin panel (Supabase/Neon/Vercel)
```

---

### Step 8: Test Production Deployment (5 minutes)

#### 8.1 Test Web App
1. Open: `https://your-web-url.vercel.app`
2. Click "Login"
3. Try credentials:
   - Email: `admin@example.com`
   - Password: `password123`
4. Verify dashboard loads
5. Check influencers page
6. Test search and filters

#### 8.2 Test Public Discovery
1. Open: `https://your-web-url.vercel.app/discover`
2. Verify influencers load (no login required)
3. Test search functionality
4. Test category filters

#### 8.3 Test API Directly
```powershell
# Test auth endpoint
$response = Invoke-RestMethod -Uri "https://your-api-url.vercel.app/api/auth/login" -Method POST -Body (@{email="admin@example.com"; password="password123"} | ConvertTo-Json) -ContentType "application/json"
$response

# Test influencers endpoint
Invoke-RestMethod -Uri "https://your-api-url.vercel.app/api/influencers" -Method GET
```

---

## 📋 Final Submission Checklist

### Before Emailing

- [ ] ✅ API deployed to Vercel
- [ ] ✅ Web deployed to Vercel
- [ ] ✅ Database created and seeded
- [ ] ✅ Environment variables configured
- [ ] ✅ CORS updated with web URL
- [ ] ✅ Test credentials work
- [ ] ✅ Public discovery page accessible
- [ ] ✅ Repository access granted to `u-primemedia`
- [ ] ✅ All tests passing locally
- [ ] ✅ Deployment URLs documented

### Deployment URLs to Include in Email

```
Frontend: https://[your-web-url].vercel.app
Backend: https://[your-api-url].vercel.app
Repository: https://github.com/peamz4/discover-influencers
```

### Test Credentials to Include

```
Admin Account:
- Email: admin@example.com
- Password: password123

Editor Account:
- Email: editor@example.com
- Password: password123

Viewer Account:
- Email: viewer@example.com
- Password: password123
```

---

## 🎯 Email Template

**Subject**: Prime Influencer Platform - Final Submission - [Your Name]

**To**: 
- pongchanok@primemedia.co.th
- olan@primemedia.co.th

**Body**:
```
Dear Prime Media Team,

I am pleased to submit my completed Prime Influencer Discovery Platform.

DEPLOYMENT LINKS:
✅ Frontend: https://[your-web-url].vercel.app
✅ Backend API: https://[your-api-url].vercel.app
✅ Repository: https://github.com/peamz4/discover-influencers

TEST CREDENTIALS:
👤 Admin: admin@example.com / password123
👤 Editor: editor@example.com / password123
👤 Viewer: viewer@example.com / password123

KEY FEATURES:
✅ User authentication with JWT (access + refresh tokens)
✅ Role-based access control (Admin, Editor, Viewer)
✅ Full influencer CRUD operations
✅ Advanced search & filtering (7+ filter options)
✅ Public discovery page (no login required)
✅ User management dashboard
✅ Category management
✅ 34/34 integration tests passing
✅ Complete documentation (20+ files)
✅ Production-ready deployment

TESTING:
All 34 integration tests passing with real PostgreSQL database
Test command: cd apps/api && pnpm test
Coverage: Auth (7), Users (8), Influencers (11), Categories (4), Middleware (4)

TIME SPENT: ~40 hours total development time
- Backend development: 12h
- Frontend development: 10h
- Testing: 6h
- Documentation: 4h
- Planning & setup: 4h
- Polish & optimization: 4h

DOCUMENTATION:
📚 Main README: https://github.com/peamz4/discover-influencers/blob/main/README.md
📚 Documentation Index: https://github.com/peamz4/discover-influencers/blob/main/.docs/README.md
📚 Deployment Guide: https://github.com/peamz4/discover-influencers/blob/main/.docs/deployment/INDEX.md
📚 API Reference: https://github.com/peamz4/discover-influencers/blob/main/.docs/api/API_DOCUMENTATION.md
📚 Final Submission: https://github.com/peamz4/discover-influencers/blob/main/.docs/FINAL_SUBMISSION.md

TECHNOLOGY STACK:
Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
Backend: Express.js, TypeScript, Prisma ORM, PostgreSQL
Deployment: Vercel (Web + API serverless functions)
Testing: Jest + Supertest (34 tests, 100% pass rate)

REPOSITORY ACCESS:
✅ Access granted to GitHub user: u-primemedia
✅ Branch: main
✅ Full commit history available

KNOWN LIMITATIONS & NEXT STEPS:
⚠️ Image upload not implemented (static placeholders used)
⚠️ Email verification not implemented
⚠️ Social media API integration pending
🚀 Next: Image upload (Cloudinary), Email service, Advanced analytics

Please let me know if you need any additional information, have questions, or would like me to walk through any specific features.

Best regards,
[Your Name]
[Your Email]
[Your Phone]
```

---

## 🔧 Troubleshooting

### Issue: Build Failed

**Error**: "Module not found"
```powershell
# Solution: Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: Database Connection Failed

**Error**: "Can't reach database server"
```powershell
# Solution: Check DATABASE_URL format
# Should include ?sslmode=require for cloud databases
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### Issue: CORS Error

**Error**: "CORS policy blocked"
```powershell
# Solution: Update API CORS_ORIGIN to match web URL exactly
# No trailing slash!
CORS_ORIGIN=https://your-web.vercel.app
```

### Issue: 500 Internal Server Error

**Solution**: Check Vercel Function logs
1. Go to Vercel Dashboard
2. Select API project
3. Click "Functions" tab
4. Click on failing function
5. View logs for error details

---

## 📞 Support

If you encounter issues during deployment:

1. **Check Vercel Logs**: Dashboard > Deployments > View Function Logs
2. **Check Database**: Verify connection in Prisma Studio
3. **Review Environment Variables**: Ensure all are set correctly
4. **Test Locally First**: Make sure it works locally before deploying

---

**Ready to Deploy?** Start with Step 1! 🚀

**Questions?** Check the troubleshooting section or review `.docs/deployment/INDEX.md`

---

_Last Updated: November 10, 2025_
_Part of Prime Influencer Platform Documentation_
