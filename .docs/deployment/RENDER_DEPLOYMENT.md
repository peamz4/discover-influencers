# Deploy Backend to Render - Complete Guide

## 🎯 Why Render?
- ✅ 100% FREE (no credit card required)
- ✅ PostgreSQL database included
- ✅ No deployment protection/authentication issues
- ✅ Auto-deploy from GitHub
- ✅ HTTPS by default
- ✅ 5-minute setup

## ⚠️ Important Note
Free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds. This is acceptable for demos/assignments.

---

## 📋 Step-by-Step Deployment

### Step 1: Sign Up for Render (2 minutes)

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your repositories

---

### Step 2: Create PostgreSQL Database (2 minutes)

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name:** `discover-influencers-db`
   - **Database:** `discover_influencers`
   - **User:** `discover_influencers_user` (auto-generated)
   - **Region:** Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **PostgreSQL Version:** 16
   - **Plan:** **FREE**
3. Click **"Create Database"**
4. Wait 1-2 minutes for provisioning
5. **Copy the "Internal Database URL"** (starts with `postgresql://`)
   - Example: `postgresql://discover_influencers_user:xxxxx@dpg-xxxxx/discover_influencers`

---

### Step 3: Create Web Service (3 minutes)

1. From Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Click **"Connect account"** if not connected
   - Find **"discover-influencers"** repository
   - Click **"Connect"**
3. Fill in service details:
   - **Name:** `discover-influencers-api`
   - **Region:** Same as your database
   - **Branch:** `main`
   - **Root Directory:** `apps/api`
   - **Environment:** `Node`
   - **Build Command:** `cd ../.. && pnpm install --frozen-lockfile && cd apps/api && npx prisma generate && npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** **FREE**

4. Click **"Advanced"** and set:
   - **Auto-Deploy:** `Yes` (deploys on git push)

---

### Step 4: Set Environment Variables (2 minutes)

In the **Environment** section, add these variables:

```bash
NODE_ENV=production

# Database (paste your Internal Database URL from Step 2)
DATABASE_URL=postgresql://discover_influencers_user:xxxxx@dpg-xxxxx/discover_influencers

# JWT Secrets (use strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production-min-32-chars
**JWT_REFRESH_SECRET**=your-super-secret-refresh-key-change-this-in-production-min-32-chars

# CORS (your frontend URL - will update after deploying frontend)
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_TO_FILES=false
```

**To generate secure JWT secrets:**
```bash
# Run in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Run this twice to get two different secrets.

---

### Step 5: Deploy! (2 minutes)

1. Click **"Create Web Service"**
2. Render will:
   - ✅ Clone your repository
   - ✅ Install dependencies
   - ✅ Run Prisma generate
   - ✅ Build TypeScript
   - ✅ Start the server
3. Watch the logs in real-time
4. Wait for **"Your service is live 🎉"**

---

### Step 6: Run Database Migrations (2 options)

**Option A: From Render Shell (Requires Paid Plan)**

1. In your Render Web Service dashboard, click **"Shell"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   ```
3. Wait for migrations to complete
4. (Optional) Seed data:
   ```bash
   npx prisma db seed
   ```

**Option B: From Your Local Machine (FREE - Recommended)**

1. Get your External Database URL from Render:
   - Go to Render Dashboard → `discover-influencers-db`
   - Scroll to **"Connections"** section
   - Copy the **"External Database URL"**
   - Example: `postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com/discover_influencers`

2. Run migrations locally:
   ```bash
   # In your project directory (apps/api)
   cd apps/api
   
   # Set the database URL temporarily
   $env:DATABASE_URL="postgresql://your-external-database-url-here"
   
   # Run migrations
   npx prisma migrate deploy
   
   # (Optional) Seed data
   npx prisma db seed
   ```

3. Done! Your production database is now migrated.

---

### Step 7: Test Your API (1 minute)

Your API is now live at: `https://discover-influencers-api.onrender.com`

Test the health endpoint:
```bash
# PowerShell:
Invoke-WebRequest -Uri "https://discover-influencers-api.onrender.com/api/health"

# Or visit in browser:
https://discover-influencers-api.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Prime Influencer API is running",
  "timestamp": "2025-11-10T...",
  "environment": "production"
}
```

---

### Step 8: Update Frontend to Use New API (2 minutes)

1. Go to Vercel (your frontend deployment)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://discover-influencers-api.onrender.com
   ```
4. Redeploy frontend

**OR** update locally:
```bash
# In apps/web/.env.local
NEXT_PUBLIC_API_URL=https://discover-influencers-api.onrender.com
```

---

### Step 9: Update CORS_ORIGIN (1 minute)

1. Back in Render API dashboard
2. Go to **Environment** tab
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://discover-influencers-web.vercel.app
   ```
4. Render will auto-redeploy

---

## ✅ Deployment Complete!

**Your URLs:**
- 🔹 **API:** `https://discover-influencers-api.onrender.com`
- 🔹 **Frontend:** `https://discover-influencers-web.vercel.app`
- 🔹 **Database:** Hosted on Render (internal)

---

## 🔧 Useful Render Features

### View Logs
1. Go to your Web Service
2. Click **"Logs"** tab
3. See real-time application logs

### Access Database
1. Go to your PostgreSQL database
2. Click **"Connect"**
3. Choose:
   - **PSQL Command** (terminal)
   - **External Connection** (pgAdmin, DataGrip)

### Manual Redeploy
1. Go to Web Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Custom Domain (Optional)
1. Go to **"Settings"** → **"Custom Domain"**
2. Add your domain
3. Update DNS records

---

## 📊 Monitoring

**Health Checks:**
Render automatically pings your service. If it fails 3 times, you get an email.

**Performance:**
- First request after spin-down: ~30 seconds (cold start)
- Subsequent requests: <100ms
- Stays awake for 15 minutes after last request

---

## 🐛 Troubleshooting

### Build Fails
**Error:** `Cannot find module 'prisma'` or `Could not find Prisma schema`
**Fix:** Ensure build command is: `cd ../.. && pnpm install --frozen-lockfile && cd apps/api && npx prisma generate && npm run build`

**Error:** `@prisma/client did not initialize yet`
**Fix:** This means Prisma generate didn't run in the correct directory. Use the build command above.

**Error:** `Parameter 'x' implicitly has an 'any' type`
**Fix:** This has been fixed in the latest code. Pull latest changes from main branch.

### Database Connection Fails
**Error:** `Can't reach database server`
**Fix:** 
- Use **Internal Database URL** (not External)
- Ensure database and web service are in same region

### CORS Errors
**Fix:**
- Set `CORS_ORIGIN` to your exact frontend URL (no trailing slash)
- Redeploy after changing environment variables

### 401 Unauthorized
**Fix:**
- This was the Vercel issue - doesn't exist on Render! 🎉
- No deployment protection on Render

---

## 💰 Pricing

**Free Tier Includes:**
- ✅ 750 hours/month (enough for 24/7 if you only run 1 service)
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ PostgreSQL 1GB storage
- ✅ Auto SSL
- ✅ Auto deploys

**After Free Tier:**
- Paid plans start at $7/month
- Get 400 build minutes/month free
- $0.072/hour (~$50/month for always-on)

**For this assignment:** FREE tier is perfect! ✅

---

## 🎯 Next Steps

1. ✅ Deploy backend to Render (follow steps above)
2. ✅ Update frontend environment variables
3. ✅ Test registration/login
4. ✅ Grant repository access to u-primemedia
5. ✅ Send submission email

---

## 📞 Support

**Render Documentation:** https://render.com/docs
**Community:** https://community.render.com
**Status:** https://status.render.com

**Issues?** Check the **Logs** tab in your Render dashboard!
