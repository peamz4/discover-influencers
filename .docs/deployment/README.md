# 🚀 Vercel Deployment - Complete Guide

This project is ready to deploy to Vercel! Both the **Web App** (Next.js) and **API** (Express.js) can be deployed as separate Vercel projects from the same monorepo.

---

## 📚 Documentation Files

We've created comprehensive documentation for deployment:

1. **[DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)** - ⚡ Quick 5-minute setup guide
2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - ✅ Detailed step-by-step checklist
3. **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - 📖 Complete deployment guide with troubleshooting

---

## ⚡ Quick Start (5 Steps)

### Prerequisites
- Vercel account ([signup here](https://vercel.com/signup))
- GitHub account with this repo
- Production database (Vercel Postgres, Supabase, or Neon)

### Step 1: Prepare JWT Secrets
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run this twice to generate two different secrets.

### Step 2: Deploy API
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `apps/api`
   - **Build Command**: `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api vercel-build`
4. Add environment variables (see [Environment Variables](#environment-variables))
5. Deploy!

### Step 3: Deploy Web
1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same** GitHub repository
3. Configure:
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app`
5. Deploy!

### Step 4: Update CORS
1. Go to API project settings
2. Update `CORS_ORIGIN` to your Web URL
3. Redeploy API

### Step 5: Test
- Visit your Web URL
- Try login/register
- Check all functionality works

**Done! 🎉**

---

## 🔐 Environment Variables

### API Environment Variables
Add these in Vercel Dashboard → API Project → Settings → Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your_generated_secret_1
REFRESH_TOKEN_SECRET=your_generated_secret_2
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://your-web-app.vercel.app
LOG_TO_FILES=false
VERCEL=1
```

### Web Environment Variables
Add these in Vercel Dashboard → Web Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app
```

---

## 📁 What's Been Configured

### Files Created/Updated for Deployment

✅ **Configuration Files**:
- `vercel.json` - Root Vercel configuration
- `apps/api/vercel.json` - API-specific Vercel config
- `apps/web/vercel.json` - Web-specific Vercel config
- `apps/api/src/api.ts` - Serverless function entry point
- `apps/web/next.config.ts` - Updated with standalone output

✅ **Updated Files**:
- `apps/api/src/server.ts` - Added serverless support (checks VERCEL env)
- `apps/api/package.json` - Added `vercel-build` script

✅ **Documentation**:
- `DEPLOYMENT_QUICKSTART.md` - Quick reference guide
- `DEPLOYMENT_CHECKLIST.md` - Detailed checklist
- `VERCEL_DEPLOYMENT.md` - Complete guide with troubleshooting
- `check-deployment.js` - Pre-deployment validation script

---

## 🛠️ Pre-Deployment Check

Run this command to verify everything is ready:

```bash
pnpm check-deployment
```

This will check:
- ✅ pnpm workspace configuration
- ✅ Vercel config files
- ✅ Package.json files and scripts
- ✅ Environment variable examples
- ✅ Next.js configuration
- ✅ Prisma setup
- ✅ TypeScript configs
- ✅ API server serverless setup
- ✅ Git repository status
- ✅ Dependencies installed

---

## 🏗️ Project Structure

```
discover-influencers/
├── apps/
│   ├── api/                    # Express.js API
│   │   ├── src/
│   │   │   ├── server.ts       # Main server (serverless-ready)
│   │   │   └── api.ts          # Serverless entry point
│   │   ├── vercel.json         # API Vercel config
│   │   └── package.json        # Includes vercel-build script
│   │
│   └── web/                    # Next.js App
│       ├── app/                # App Router
│       ├── vercel.json         # Web Vercel config
│       ├── next.config.ts      # Next.js config (standalone)
│       └── package.json
│
├── vercel.json                 # Root Vercel config (optional)
├── pnpm-workspace.yaml         # pnpm workspace config
├── check-deployment.js         # Pre-deployment validator
│
└── Documentation/
    ├── DEPLOYMENT_QUICKSTART.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── VERCEL_DEPLOYMENT.md
```

---

## 🔄 Deployment Workflow

### Initial Deployment
1. Commit and push code to GitHub
2. Follow [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)
3. Deploy API first, then Web
4. Update CORS settings
5. Test thoroughly

### Continuous Deployment
After initial setup, deployments are automatic:

```bash
# Make changes to code
git add .
git commit -m "Your changes"
git push origin main

# ✅ Vercel automatically deploys!
```

- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

---

## 🎯 Vercel Project Settings

### API Project Configuration

| Setting | Value |
|---------|-------|
| Framework | Other |
| Root Directory | `apps/api` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api vercel-build` |
| Output Directory | `dist` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |

### Web Project Configuration

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build` |
| Output Directory | `.next` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |

---

## 📊 Database Setup

### Recommended: Vercel Postgres

1. Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy connection string
4. Add as `DATABASE_URL` environment variable

### Alternative Options

- **Supabase**: [database.new](https://database.new) - Free tier available
- **Neon**: [neon.tech](https://neon.tech) - Serverless Postgres
- **Railway**: [railway.app](https://railway.app) - Easy setup
- **PlanetScale**: [planetscale.com](https://planetscale.com) - MySQL option

### Running Migrations

After database setup, migrations run automatically during build via `vercel-build` script.

To manually run migrations:
```bash
npm i -g vercel
vercel login
cd apps/api
vercel env pull .env.production
pnpm prisma migrate deploy
pnpm prisma db seed
```

---

## 🐛 Troubleshooting

### Build Fails
**Error**: "Cannot find module"
- **Fix**: Verify build command includes `cd ../..`
- **Fix**: Check `pnpm-workspace.yaml` exists in root

### CORS Error
**Error**: "CORS policy blocked"
- **Fix**: Update `CORS_ORIGIN` to match Web URL exactly
- **Fix**: Include `https://` protocol
- **Fix**: Redeploy API after changing

### Database Connection Error
**Error**: "Can't reach database server"
- **Fix**: Check `DATABASE_URL` format
- **Fix**: Ensure database allows Vercel IP connections
- **Fix**: Verify database is running

### API 500 Error
**Error**: Internal server error
- **Fix**: Check Vercel function logs
- **Fix**: Verify all environment variables are set
- **Fix**: Check JWT secrets are configured

For more troubleshooting, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md#common-issues--solutions)

---

## 📱 Testing After Deployment

### Automated Tests
```bash
# Test API health
curl https://your-api.vercel.app/api/health

# Test API endpoints
curl https://your-api.vercel.app/api
```

### Manual Tests
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard accessible
- [ ] CRUD operations work
- [ ] Logout works
- [ ] No console errors

---

## 🔒 Security Checklist

- [ ] JWT secrets are strong random values (not example values)
- [ ] `DATABASE_URL` uses secure password
- [ ] `CORS_ORIGIN` set to specific domain (not `*`)
- [ ] `.env` files not committed to git
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables stored in Vercel (not in code)

---

## 📈 Monitoring & Analytics

### Enable Vercel Analytics
1. Dashboard → Project → Analytics
2. Enable Web Analytics (Web project)
3. Enable Function Analytics (API project)

### Check Logs
1. Dashboard → Project → Deployments
2. Click on deployment
3. View Function Logs or Build Logs

---

## 🎨 Custom Domains (Optional)

### Add Custom Domain
1. Dashboard → Project → Settings → Domains
2. Add domain (e.g., `api.yourdomain.com`, `app.yourdomain.com`)
3. Configure DNS as instructed
4. Update environment variables with new domains:
   - API: `CORS_ORIGIN=https://app.yourdomain.com`
   - Web: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
5. Redeploy both projects

---

## 💡 Best Practices

1. **Environment Variables**: Different values for production vs preview
2. **Git Workflow**: Use branches and PRs for new features
3. **Preview Deployments**: Test changes before merging to main
4. **Monitor Logs**: Check function logs regularly for errors
5. **Database Backups**: Regular backups of production database
6. **Secrets Rotation**: Change JWT secrets periodically

---

## 🚀 Next Steps After Deployment

1. ✅ Test all functionality thoroughly
2. ✅ Set up custom domains (optional)
3. ✅ Enable analytics and monitoring
4. ✅ Set up error notifications
5. ✅ Document API for team members
6. ✅ Add more features!

---

## 📞 Get Help

- **Quick Reference**: [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)
- **Detailed Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**External Resources**:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides)

---

## ✨ What Makes This Deployment Special

✅ **Monorepo Support**: Both apps from one repository
✅ **pnpm Workspace**: Efficient dependency management
✅ **Serverless Ready**: API runs as serverless functions
✅ **Auto Migrations**: Database migrations run on build
✅ **Standalone Build**: Optimized Next.js output
✅ **Environment Isolation**: Separate production/preview configs
✅ **Security Built-in**: JWT, CORS, Helmet.js configured
✅ **Monitoring Ready**: Analytics and logs available

---

**Ready to deploy? Start with [DEPLOYMENT_QUICKSTART.md](./DEPLOYMENT_QUICKSTART.md)! 🚀**

---

_Last Updated: November 10, 2025_
_Project: Discover Influencers Platform_
_Stack: Next.js 16 + Express.js + PostgreSQL + Prisma_
