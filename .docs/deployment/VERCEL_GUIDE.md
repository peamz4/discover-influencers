# Vercel Deployment Guide - Step by Step

This guide will help you deploy both the **Web App** (Next.js) and **API** (Express) to Vercel using pnpm workspace.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```
3. **PostgreSQL Database**: You'll need a production database (e.g., Vercel Postgres, Supabase, or Neon)
4. **GitHub Repository**: Push your code to GitHub

---

## 🗄️ Step 1: Set Up Production Database

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** → **Create Database**
3. Select **Postgres**
4. Choose your region and click **Create**
5. Copy the `DATABASE_URL` from the `.env.local` tab

### Option B: Alternative Services

- **Supabase**: [database.new](https://database.new)
- **Neon**: [neon.tech](https://neon.tech)
- **Railway**: [railway.app](https://railway.app)

---

## 🚀 Step 2: Deploy API to Vercel

### 2.1 Create New Project for API

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Project Name**: `discover-influencers-api` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api`
   - **Build Command**: 
     ```bash
     cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api build && pnpm --filter api prisma:generate
     ```
   - **Output Directory**: `dist`
   - **Install Command**: 
     ```bash
     cd ../.. && pnpm install --frozen-lockfile
     ```

### 2.2 Configure API Environment Variables

Add these environment variables in **Project Settings** → **Environment Variables**:

```env
# Node Environment
NODE_ENV=production

# Database
DATABASE_URL=your_production_database_url_from_step_1

# JWT - Access Token
JWT_SECRET=generate_strong_random_secret_64_chars
ACCESS_TOKEN_EXPIRES_IN=15m

# JWT - Refresh Token  
REFRESH_TOKEN_SECRET=generate_another_strong_random_secret_64_chars
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS (will update after web deployment)
CORS_ORIGIN=https://your-web-app.vercel.app

# Logging
LOG_TO_FILES=false

# Vercel Flag
VERCEL=1
```

**🔑 Generate Strong Secrets:**
Run this command locally to generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.3 Run Database Migration

After deployment, you need to run Prisma migrations:

**Using Vercel CLI:**
```bash
vercel env pull .env.production
cd apps/api
pnpm prisma migrate deploy
pnpm prisma db seed
```

**Or add a build script** to `apps/api/package.json`:
```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy && tsc"
}
```

Then update Vercel build command to:
```bash
cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api vercel-build
```

### 2.4 Get Your API URL

After deployment, your API will be at:
```
https://discover-influencers-api.vercel.app
```

Test it:
```bash
curl https://your-api-url.vercel.app/api/health
```

---

## 🌐 Step 3: Deploy Web App to Vercel

### 3.1 Create New Project for Web

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository **again** (separate project)
3. Configure the project:
   - **Project Name**: `discover-influencers-web` (or your choice)
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: 
     ```bash
     cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build
     ```
   - **Output Directory**: `.next`
   - **Install Command**: 
     ```bash
     cd ../.. && pnpm install --frozen-lockfile
     ```

### 3.2 Configure Web Environment Variables

Add these environment variables:

```env
# API URL (use your API URL from Step 2.4)
NEXT_PUBLIC_API_URL=https://discover-influencers-api.vercel.app
```

### 3.3 Deploy Web App

Click **Deploy** and wait for the build to complete.

Your web app will be at:
```
https://discover-influencers-web.vercel.app
```

---

## 🔄 Step 4: Update CORS Settings

Now that both apps are deployed, update the API's CORS settings:

1. Go to API project in Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Update `CORS_ORIGIN`:
   ```env
   CORS_ORIGIN=https://discover-influencers-web.vercel.app
   ```
4. **Redeploy** the API (Settings → Deployments → Click latest → Redeploy)

---

## ✅ Step 5: Verify Deployment

### Test API:
```bash
# Health check
curl https://your-api-url.vercel.app/api/health

# API info
curl https://your-api-url.vercel.app/api
```

### Test Web App:
1. Open `https://your-web-url.vercel.app`
2. Try to login/register
3. Check browser console for errors

---

## 🔧 Step 6: Update Package.json Scripts (Optional)

Add deployment scripts to root `package.json`:

```json
{
  "scripts": {
    "deploy:api": "vercel --prod --cwd apps/api",
    "deploy:web": "vercel --prod --cwd apps/web",
    "deploy:all": "pnpm deploy:api && pnpm deploy:web"
  }
}
```

---

## 🎯 Common Issues & Solutions

### Issue 1: Build Fails - "Cannot find module"
**Solution**: Ensure `pnpm-workspace.yaml` is in root and install command includes `cd ../..`

### Issue 2: API Returns 500 Error
**Solution**: 
- Check environment variables are set correctly
- Check database connection
- View logs in Vercel Dashboard → Deployments → Function Logs

### Issue 3: CORS Errors
**Solution**: 
- Ensure `CORS_ORIGIN` matches your web app URL exactly
- Include protocol (`https://`)
- No trailing slash

### Issue 4: Database Connection Fails
**Solution**:
- Verify `DATABASE_URL` format
- Check database is accessible from Vercel (not localhost)
- Run migrations: `prisma migrate deploy`

### Issue 5: JWT Errors
**Solution**:
- Generate strong random secrets
- Don't use example secrets in production
- Ensure secrets are the same across all API instances

---

## 📝 Environment Variables Checklist

### API (.env)
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (production database)
- [ ] `JWT_SECRET` (strong random 64+ chars)
- [ ] `REFRESH_TOKEN_SECRET` (strong random 64+ chars)
- [ ] `ACCESS_TOKEN_EXPIRES_IN=15m`
- [ ] `REFRESH_TOKEN_EXPIRES_IN=7d`
- [ ] `CORS_ORIGIN` (your web app URL)
- [ ] `LOG_TO_FILES=false`
- [ ] `VERCEL=1`

### Web (.env)
- [ ] `NEXT_PUBLIC_API_URL` (your API URL)

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Generate with crypto
3. **Enable HTTPS only** - Vercel provides this automatically
4. **Rotate secrets regularly** - Update JWT secrets periodically
5. **Use environment variables** - Never hardcode secrets
6. **Limit CORS origins** - Only allow your web app domain

---

## 📊 Monitoring & Logs

### View Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments**
4. Click on a deployment
5. View **Function Logs** or **Build Logs**

### Enable Analytics:
1. Vercel Dashboard → Project
2. **Analytics** tab
3. Enable **Web Analytics** for the web app

---

## 🔄 Continuous Deployment

Both projects will auto-deploy when you push to GitHub:

1. **Push to `main` branch** → Triggers production deployment
2. **Push to other branches** → Creates preview deployment
3. **Pull requests** → Generates preview URLs

### Disable Auto-Deploy (Optional):
Settings → Git → Ignored Build Step

---

## 🚀 Quick Deploy Commands

If using Vercel CLI:

```bash
# Login to Vercel
vercel login

# Deploy API (from root)
cd apps/api
vercel --prod

# Deploy Web (from root)
cd apps/web
vercel --prod

# Or use pnpm scripts (if added)
pnpm deploy:all
```

---

## 📦 Project Structure Reference

```
discover-influencers/
├── apps/
│   ├── api/
│   │   ├── vercel.json          # API Vercel config
│   │   ├── src/
│   │   │   ├── server.ts        # Updated for serverless
│   │   │   └── api.ts           # Serverless entry point
│   │   └── package.json
│   └── web/
│       ├── vercel.json          # Web Vercel config
│       ├── next.config.ts       # Updated for deployment
│       └── package.json
├── vercel.json                  # Root config (optional)
├── pnpm-workspace.yaml
└── package.json
```

---

## ✨ Post-Deployment Steps

1. **Test all functionality**:
   - [ ] User registration
   - [ ] User login
   - [ ] Influencer CRUD operations
   - [ ] Admin dashboard
   - [ ] Discover page

2. **Set up custom domains** (optional):
   - Vercel Dashboard → Project → Settings → Domains
   - Add custom domain (e.g., `api.yourdomain.com`, `app.yourdomain.com`)

3. **Enable preview deployments**:
   - Automatically created for PRs
   - Great for testing before merging

4. **Monitor performance**:
   - Check Vercel Analytics
   - Monitor function execution times
   - Watch for errors in logs

---

## 🎉 Success!

Your application is now deployed:
- ✅ API running on Vercel serverless functions
- ✅ Web app running on Vercel edge network
- ✅ Database connected and migrated
- ✅ Automatic deployments on git push
- ✅ HTTPS enabled by default
- ✅ Global CDN for fast loading

**Next Steps**:
- Share your URLs with users
- Set up monitoring/alerts
- Configure custom domains
- Add more features!

---

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

## 🔗 Useful Links

- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
