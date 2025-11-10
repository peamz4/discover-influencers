# ✅ Vercel Deployment Checklist

Use this checklist to ensure smooth deployment of both Web and API to Vercel.

---

## 📋 Pre-Deployment Checklist

### 🔍 Project Verification
- [ ] Run `pnpm check-deployment` to verify project structure
- [ ] All tests passing: `pnpm --filter api test`
- [ ] Local build successful: `pnpm build`
- [ ] Git repository initialized and code committed
- [ ] Code pushed to GitHub repository

### 🗄️ Database Setup
- [ ] Production database created (Vercel Postgres/Supabase/Neon)
- [ ] Database URL copied and ready
- [ ] Database accessible from internet (not localhost)
- [ ] Database migrations tested locally

### 🔐 Security Preparation
- [ ] JWT secrets generated (2x): `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] Secrets saved securely (password manager/env file - not in git)
- [ ] `.env` files NOT committed to git (check `.gitignore`)
- [ ] Environment variable values ready to paste

---

## 🚀 API Deployment Steps

### Step 1: Create API Project
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Project"
- [ ] Select GitHub repository
- [ ] Click "Import"

### Step 2: Configure API Project
- [ ] **Project Name**: `discover-influencers-api` (or your choice)
- [ ] **Framework Preset**: Other
- [ ] **Root Directory**: Click "Edit" → Select `apps/api`
- [ ] **Build Command**: 
  ```
  cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api vercel-build
  ```
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: 
  ```
  cd ../.. && pnpm install --frozen-lockfile
  ```

### Step 3: Add API Environment Variables
Go to **Settings** → **Environment Variables** and add:

- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `your_production_database_url`
- [ ] `JWT_SECRET` = `generated_secret_1`
- [ ] `ACCESS_TOKEN_EXPIRES_IN` = `15m`
- [ ] `REFRESH_TOKEN_SECRET` = `generated_secret_2`
- [ ] `REFRESH_TOKEN_EXPIRES_IN` = `7d`
- [ ] `CORS_ORIGIN` = `https://your-web-app.vercel.app` (temporary, update later)
- [ ] `LOG_TO_FILES` = `false`
- [ ] `VERCEL` = `1`

### Step 4: Deploy API
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2-5 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy API URL (e.g., `https://discover-influencers-api.vercel.app`)

### Step 5: Test API
- [ ] Open: `https://your-api-url.vercel.app/api/health`
- [ ] Should return: `{"status":"OK",...}`
- [ ] Open: `https://your-api-url.vercel.app/api`
- [ ] Should return API documentation

### Step 6: Run Database Migrations (if needed)
Choose one method:

**Method A - Vercel CLI:**
```bash
npm i -g vercel
vercel login
cd apps/api
vercel env pull .env.production
pnpm prisma migrate deploy
pnpm prisma db seed
```

**Method B - Already done in build script:**
- [ ] `vercel-build` script includes `prisma migrate deploy`
- [ ] Check build logs to confirm migrations ran

---

## 🌐 Web Deployment Steps

### Step 1: Create Web Project
- [ ] Go to [vercel.com/new](https://vercel.com/new) again
- [ ] Click "Import Project"
- [ ] Select the **same** GitHub repository
- [ ] Click "Import"

### Step 2: Configure Web Project
- [ ] **Project Name**: `discover-influencers-web` (or your choice)
- [ ] **Framework Preset**: Next.js (should auto-detect)
- [ ] **Root Directory**: Click "Edit" → Select `apps/web`
- [ ] **Build Command**: 
  ```
  cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build
  ```
- [ ] **Output Directory**: `.next` (should be default)
- [ ] **Install Command**: 
  ```
  cd ../.. && pnpm install --frozen-lockfile
  ```

### Step 3: Add Web Environment Variables
Go to **Settings** → **Environment Variables** and add:

- [ ] `NEXT_PUBLIC_API_URL` = `https://your-api-url.vercel.app` (from API deployment)

### Step 4: Deploy Web
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2-5 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy Web URL (e.g., `https://discover-influencers-web.vercel.app`)

### Step 5: Test Web App
- [ ] Open: `https://your-web-url.vercel.app`
- [ ] Page loads without errors
- [ ] Check browser console (F12) for errors

---

## 🔄 Post-Deployment Configuration

### Update API CORS
- [ ] Go to API project on Vercel Dashboard
- [ ] Navigate to **Settings** → **Environment Variables**
- [ ] Find `CORS_ORIGIN` variable
- [ ] Update value to actual Web URL: `https://your-web-url.vercel.app`
- [ ] Click **Save**
- [ ] Go to **Deployments** tab
- [ ] Click on latest deployment → **⋯** → **Redeploy**
- [ ] Wait for redeployment to complete

---

## ✅ Final Testing

### API Functionality
- [ ] Health check: `curl https://your-api.vercel.app/api/health`
- [ ] API docs: Visit `https://your-api.vercel.app/api`
- [ ] Check Vercel logs for errors: Dashboard → Project → Deployments → Function Logs

### Web App Functionality
Test all features:
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] User Registration
  - [ ] Go to `/register`
  - [ ] Create new account
  - [ ] Check browser console for errors
- [ ] User Login
  - [ ] Go to `/login`
  - [ ] Login with created account
  - [ ] Should redirect to dashboard
- [ ] Dashboard
  - [ ] Dashboard loads
  - [ ] Sidebar navigation works
  - [ ] User info displays correctly
- [ ] Influencers Management
  - [ ] View influencers list
  - [ ] Search/filter works
  - [ ] Create new influencer (if admin)
  - [ ] Edit influencer
  - [ ] View influencer details
- [ ] User Management (Admin only)
  - [ ] View users list
  - [ ] Create new user
  - [ ] Edit user
- [ ] Discover Page
  - [ ] Public page loads
  - [ ] Filters work
  - [ ] Search works
  - [ ] Pagination works
- [ ] Logout
  - [ ] Logout button works
  - [ ] Redirects to homepage

### Browser Console Check
- [ ] No red errors in console
- [ ] No CORS errors
- [ ] API calls successful (check Network tab)

---

## 🔧 Common Issues & Fixes

### ❌ Issue: "Module not found" during build
**Fix:**
- Verify `pnpm-workspace.yaml` exists in root
- Check build command includes `cd ../..`
- Ensure `--frozen-lockfile` flag is used

### ❌ Issue: CORS error in browser
**Fix:**
- Check `CORS_ORIGIN` in API env vars
- Must match Web URL exactly (including `https://`)
- No trailing slash
- Redeploy API after changing

### ❌ Issue: API returns 500 error
**Fix:**
- Check Vercel Function Logs
- Verify all environment variables are set
- Test database connection
- Check JWT secrets are set

### ❌ Issue: Database connection failed
**Fix:**
- Verify `DATABASE_URL` format
- Ensure database allows connections from Vercel
- Run migrations: `prisma migrate deploy`
- Check database is online

### ❌ Issue: Build timeout
**Fix:**
- Upgrade Vercel plan if needed
- Optimize build process
- Check for large dependencies

### ❌ Issue: Cannot login/register
**Fix:**
- Check API is deployed and accessible
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check browser console for error details
- Verify database has users table

---

## 📊 Monitoring

### Vercel Dashboard
- [ ] API project → Analytics enabled
- [ ] Web project → Analytics enabled
- [ ] Set up error notifications: Settings → Notifications

### Check Regularly
- [ ] Function execution times
- [ ] Error rates
- [ ] Bandwidth usage
- [ ] Build times

---

## 🎯 Optional Enhancements

### Custom Domains
- [ ] API: Settings → Domains → Add custom domain (e.g., `api.yourdomain.com`)
- [ ] Web: Settings → Domains → Add custom domain (e.g., `app.yourdomain.com`)
- [ ] Update `CORS_ORIGIN` with custom domain
- [ ] Update `NEXT_PUBLIC_API_URL` with custom domain

### Preview Deployments
- [ ] Enable preview deployments for PRs
- [ ] Set up preview environment variables (if different from production)

### Security Headers
- [ ] Review Helmet.js configuration in API
- [ ] Add CSP headers if needed
- [ ] Review Next.js security headers

### Performance
- [ ] Enable Vercel Analytics
- [ ] Set up Web Vitals monitoring
- [ ] Review and optimize bundle size
- [ ] Enable Edge Functions if beneficial

---

## 📝 Deployment Summary

After completing all steps, you should have:

✅ **API Deployed**: `https://your-api-name.vercel.app`
- Health check working
- API endpoints responding
- Database connected
- Migrations applied

✅ **Web App Deployed**: `https://your-web-name.vercel.app`
- Homepage loading
- Authentication working
- All CRUD operations functional
- No console errors

✅ **Integration Working**:
- CORS configured correctly
- API calls from web app successful
- JWT authentication working
- Database operations working

---

## 🎉 Success!

Your application is now live on Vercel!

### Share Your URLs
- **API**: `https://your-api-url.vercel.app`
- **Web**: `https://your-web-url.vercel.app`

### Automatic Deployments
Every git push to `main` will trigger automatic deployments.

### Next Steps
1. Set up custom domains (optional)
2. Monitor application performance
3. Set up error tracking
4. Add more features!

---

## 📞 Support Resources

- **Full Guide**: `VERCEL_DEPLOYMENT.md`
- **Quick Start**: `DEPLOYMENT_QUICKSTART.md`
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)

---

**Last Updated**: November 10, 2025
