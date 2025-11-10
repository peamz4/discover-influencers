# 🚀 Vercel Deployment - Quick Reference

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Deploy API
```bash
# Go to vercel.com/new
# Import GitHub repo
# Root Directory: apps/api
# Build Command: cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api vercel-build
```

### 2️⃣ Set API Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=run_node_crypto_randomBytes_64
REFRESH_TOKEN_SECRET=run_node_crypto_randomBytes_64
CORS_ORIGIN=https://your-web-app.vercel.app
LOG_TO_FILES=false
VERCEL=1
```

### 3️⃣ Deploy Web
```bash
# Go to vercel.com/new (again, new project)
# Import same GitHub repo
# Root Directory: apps/web
# Build Command: cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build
```

### 4️⃣ Set Web Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app
```

### 5️⃣ Update API CORS
```bash
# In API project settings, update:
CORS_ORIGIN=https://your-actual-web-url.vercel.app
# Then redeploy API
```

---

## 🔑 Generate JWT Secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run twice to get two different secrets for JWT_SECRET and REFRESH_TOKEN_SECRET.

---

## 📋 Vercel Project Settings

### API Project
| Setting | Value |
|---------|-------|
| Framework | Other |
| Root Directory | `apps/api` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter api vercel-build` |
| Output Directory | `dist` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |

### Web Project
| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Build Command | `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build` |
| Output Directory | `.next` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Create production database (Vercel Postgres/Supabase/Neon)
- [ ] Generate strong JWT secrets
- [ ] Push code to GitHub
- [ ] Review `.env.example` files

### Deploy API
- [ ] Create Vercel project for API
- [ ] Set root directory to `apps/api`
- [ ] Configure build commands
- [ ] Add all environment variables
- [ ] Deploy and get API URL
- [ ] Test: `curl https://api-url.vercel.app/api/health`

### Deploy Web
- [ ] Create separate Vercel project for Web
- [ ] Set root directory to `apps/web`
- [ ] Configure build commands
- [ ] Add `NEXT_PUBLIC_API_URL` variable
- [ ] Deploy and get Web URL
- [ ] Test: Open URL in browser

### Post-Deployment
- [ ] Update API `CORS_ORIGIN` with actual Web URL
- [ ] Redeploy API
- [ ] Test login/register flow
- [ ] Test all CRUD operations
- [ ] Check browser console for errors
- [ ] Monitor Vercel function logs

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check: pnpm-workspace.yaml exists in root
# Check: Build commands include "cd ../.."
# Check: Using --frozen-lockfile flag
```

### Database Connection Error
```bash
# Check: DATABASE_URL is correct format
# Check: Database allows connections from Vercel IPs
# Try: Run "prisma migrate deploy" manually
```

### CORS Error
```bash
# Check: CORS_ORIGIN matches Web URL exactly
# Check: Include https:// protocol
# Check: No trailing slash
# Fix: Update and redeploy API
```

### 500 Error on API
```bash
# Check: All environment variables are set
# Check: Vercel function logs for details
# Check: Database is accessible
```

---

## 📞 Quick Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Vercel Postgres**: [vercel.com/storage/postgres](https://vercel.com/storage/postgres)
- **Full Guide**: See `VERCEL_DEPLOYMENT.md`

---

## 🎯 Expected URLs

After deployment:
- **API**: `https://discover-influencers-api.vercel.app`
- **Web**: `https://discover-influencers-web.vercel.app`
- **Health Check**: `https://your-api.vercel.app/api/health`

---

## 💡 Pro Tips

1. **Use Vercel CLI** for faster deployments: `npm i -g vercel`
2. **Preview Deployments** - Every PR gets a preview URL
3. **Environment Variables** - Set different values for production/preview
4. **Custom Domains** - Add in Project Settings → Domains
5. **Monitor Logs** - Check function logs for errors

---

## 🔄 Update After Code Changes

Vercel auto-deploys on git push:
```bash
git add .
git commit -m "Update feature"
git push origin main
# ✅ Automatic deployment triggered!
```

---

**Need help?** Check the full guide in `VERCEL_DEPLOYMENT.md`
