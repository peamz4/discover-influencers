# 🚀 Prime Influencer - Quick Reference

## Most Common Commands

```bash
# Development
pnpm dev              # Start both apps
pnpm dev:web          # Frontend only (Port 3000)
pnpm dev:api          # Backend only (Port 5000)

# Build
pnpm build            # Build all
pnpm build:web        # Build frontend
pnpm build:api        # Build backend

# Production
pnpm start:web        # Run frontend
pnpm start:api        # Run backend

# Utilities
pnpm lint             # Lint all
pnpm clean            # Clean artifacts
```

## URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Add Dependencies
```bash
pnpm --filter web add <package>      # Frontend
pnpm --filter api add <package>      # Backend
pnpm add -w <package>                # Workspace
```

## Project Structure
```
discover-influencers/
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # Express Backend
├── packages/
│   └── typescript-config/
└── pnpm-workspace.yaml
```

## Documentation
- PROJECT_SUMMARY.md - Complete overview
- SETUP.md - Detailed instructions
- README.md - Project architecture
- verify-setup.ps1 - Verify installation

---
**Get Started**: `pnpm dev`
