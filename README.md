# Prime Influencer Discovery Platform

> A comprehensive full-stack influencer management system for discovering, analyzing, and collaborating with Thailand's top content creators.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://discover-influencers-web.vercel.app)
[![API Status](https://img.shields.io/badge/API-online-success)](https://discover-influencers-api.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/github-public-blue)](https://github.com/peamz4/discover-influencers)

## 🌐 Live Application

- **Frontend**: [https://discover-influencers-web.vercel.app](https://discover-influencers-web.vercel.app)
- **Backend API**: [https://discover-influencers-api.onrender.com](https://discover-influencers-api.onrender.com)
- **API Health**: [https://discover-influencers-api.onrender.com/api/health](https://discover-influencers-api.onrender.com/api/health)

### 🔑 Demo Credentials
```
Email: admin@primeinfluencer.com
Password: password123
Role: ADMIN (Full Access)
```

## � Complete Documentation

**📄 [View Full Submission Document](./.docs/SUBMISSION.md)** - Comprehensive project overview, architecture, testing, and deployment details.

### Documentation Index
- 🚀 **[Submission Document](./.docs/SUBMISSION.md)** - Complete project submission with all details
- 📖 **[Documentation Overview](./.docs/README.md)** - All documentation links
- ⚙️ **[Setup Guide](./.docs/SETUP.md)** - Local development setup
- 🔌 **[API Documentation](./.docs/API_DOCUMENTATION.md)** - Complete API reference
- � **[Render Deployment](./.docs/deployment/RENDER_DEPLOYMENT.md)** - Production deployment guide
- 🔄 **[Alternative Platforms](./.docs/deployment/ALTERNATIVE_PLATFORMS.md)** - Platform comparison

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access & refresh tokens
- HTTP-only secure cookies with SameSite=none for cross-domain
- Role-based access control (ADMIN, EDITOR, VIEWER)
- Session persistence and automatic token refresh
- Protected routes with middleware

### 👥 Influencer Management
- Complete CRUD operations for influencer profiles
- Advanced search and filtering (category, tier, status)
- Social media metrics tracking (followers, engagement rate)
- Individual profiles with detailed information
- Pagination with customizable page sizes

### 📊 Analytics Dashboard
- Real-time statistics and insights
- Category and tier distribution charts
- Top performers rankings
- Average engagement metrics
- Status breakdown visualization

### 👤 User Management (Admin Only)
- Create, read, update, delete users
- Role assignment and management
- User search and filtering
- Activity tracking

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark theme with gradient effects
- Smooth animations and transitions
- Loading states and error handling
- Intuitive navigation

## 🏗️ Architecture

### Tech Stack Overview

**Frontend (Vercel)**
```
Next.js 15.1.3 (App Router) + React 19
├── TypeScript 5.9.3
├── Tailwind CSS 4.0.0
├── Zustand (State Management)
├── Axios (API Client)
├── Recharts (Analytics)
└── shadcn/ui Components
```

**Backend (Render)**
```
Express.js 5.1.0 + Node.js 22.16.0
├── TypeScript 5.9.3
├── Prisma ORM 6.19.0
├── PostgreSQL 16
├── JWT Authentication
├── Winston Logging
└── Express Rate Limit
```

### Monorepo Structure
```
discover-influencers/
├── apps/
│   ├── web/                    # Next.js Frontend (Vercel)
│   │   ├── app/                # App Router pages
│   │   │   ├── dashboard/      # Protected admin pages
│   │   │   ├── login/          # Authentication
│   │   │   └── page.tsx        # Landing page
│   │   ├── components/         # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── auth-provider.tsx
│   │   │   └── dashboard-layout.tsx
│   │   ├── lib/                # Utilities
│   │   │   ├── api.ts          # Axios client
│   │   │   ├── services/       # API services
│   │   │   └── store/          # Zustand stores
│   │   └── package.json
│   │
│   └── api/                    # Express.js Backend (Render)
│       ├── src/
│       │   ├── server.ts       # Main server
│       │   ├── lib/            # Core utilities
│       │   │   ├── auth.ts     # JWT functions
│       │   │   ├── prisma.ts   # Database client
│       │   │   └── logger.ts   # Winston logger
│       │   ├── middleware/     # Express middleware
│       │   │   ├── auth.ts     # JWT verification
│       │   │   ├── error.ts    # Error handling
│       │   │   └── security.ts # Rate limiting
│       │   ├── routes/         # API endpoints
│       │   │   ├── auth.ts     # Authentication
│       │   │   ├── influencers.ts
│       │   │   ├── users.ts
│       │   │   └── categories.ts
│       │   └── __tests__/      # Jest tests (78 cases)
│       ├── prisma/
│       │   ├── schema.prisma   # Database schema
│       │   ├── seed.ts         # Seed data
│       │   └── migrations/     # DB migrations
│       └── package.json
│
├── packages/
│   └── typescript-config/      # Shared TS configs
├── .docs/                      # Documentation
│   ├── SUBMISSION.md           # **Main submission doc**
│   ├── API_DOCUMENTATION.md
│   ├── SETUP.md
│   └── deployment/
│       ├── RENDER_DEPLOYMENT.md
│       └── ALTERNATIVE_PLATFORMS.md
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **pnpm**: v8 or higher
- **PostgreSQL**: v14 or higher (for local development)

```bash
# Install pnpm globally
npm install -g pnpm
```

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/peamz4/discover-influencers.git
cd discover-influencers
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**

**Backend (.env in apps/api):**
```bash
# Copy example
cp apps/api/.env.example apps/api/.env

# Edit with your values
DATABASE_URL="postgresql://user:password@localhost:5432/influencer_db"
JWT_ACCESS_SECRET="your-super-secret-access-key-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-chars"
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
PORT=5000
LOG_TO_FILES=true
```

**Frontend (.env.local in apps/web):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Setup database**
```bash
cd apps/api

# Run migrations
npx prisma migrate deploy

# Seed data (creates admin user + sample data)
npm run db:seed
```

5. **Run the application**
```bash
# From root directory - runs both frontend and backend
pnpm dev

# Or run separately:
pnpm dev:web      # Frontend only (http://localhost:3000)
pnpm dev:api      # Backend only (http://localhost:5000)
```

6. **Login with seeded admin account**
```
Email: admin@primeinfluencer.com
Password: password123
```

### Production Build

```bash
# Build all apps
pnpm build

# Start production servers
pnpm start:web    # Next.js production server
pnpm start:api    # Express.js production server
```

## 🧪 Testing

### Test Suite Overview
- **Total Tests**: 78 test cases
- **Passing**: 29 unit tests
- **Templates**: 49 integration test scaffolds

### Running Tests

```bash
# Navigate to API directory
cd apps/api

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts

# Watch mode
npm test -- --watch
```

### Test Coverage

```
Test Suites: 3 passed, 3 total
Tests:       29 passed, 29 total
Time:        ~2.5s

Coverage Areas:
├── Authentication Middleware (10 tests) ✅
├── Authorization/RBAC (9 tests) ✅
├── Error Handling (10 tests) ✅
└── API Integration Templates (49 scaffolds) 📝
```

**Test Files:**
```
apps/api/src/__tests__/
├── middleware/
│   ├── auth.test.ts         # JWT verification tests
│   ├── rbac.test.ts         # Role-based access tests
│   └── error.test.ts        # Error handler tests
└── routes/
    ├── auth.integration.test.ts       # Auth endpoints
    ├── influencers.integration.test.ts # Influencer CRUD
    └── users.integration.test.ts      # User management
```

See [`.docs/SUBMISSION.md`](./.docs/SUBMISSION.md) for detailed test results and methodology.

## 🌐 API Reference

### Base URLs
- **Production**: `https://discover-influencers-api.onrender.com`
- **Development**: `http://localhost:5000`

### Core Endpoints

#### Authentication
```
POST   /api/auth/register      # Create new user account
POST   /api/auth/login         # Login and get tokens
POST   /api/auth/refresh       # Refresh access token
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # Logout and clear tokens
```

#### Influencers
```
GET    /api/influencers        # List all influencers (paginated)
GET    /api/influencers/:id    # Get single influencer
POST   /api/influencers        # Create influencer (ADMIN/EDITOR)
PUT    /api/influencers/:id    # Update influencer (ADMIN/EDITOR)
DELETE /api/influencers/:id    # Delete influencer (ADMIN)
GET    /api/influencers/analytics/stats  # Get statistics
```

#### Users (Admin Only)
```
GET    /api/users              # List all users
GET    /api/users/:id          # Get single user
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

#### Categories
```
GET    /api/categories         # List all categories
POST   /api/categories         # Create category (ADMIN)
```

#### Health Check
```
GET    /api/health             # API health status
```

### Query Parameters

**Influencers List:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name
- `category` - Filter by category ID
- `tier` - Filter by tier (NANO, MICRO, MID, MACRO, MEGA)
- `status` - Filter by status (ACTIVE, INACTIVE, PENDING)

**Example:**
```
GET /api/influencers?page=1&limit=20&category=tech&tier=MICRO&status=ACTIVE
```

📖 **Complete API Documentation**: [`.docs/API_DOCUMENTATION.md`](./.docs/API_DOCUMENTATION.md)

## � Deployment

### Production Deployment

**Frontend (Vercel)**
- Auto-deploys from `main` branch
- Environment: `NEXT_PUBLIC_API_URL=https://discover-influencers-api.onrender.com`
- Live at: [https://discover-influencers-web.vercel.app](https://discover-influencers-web.vercel.app)

**Backend (Render)**
- Auto-deploys from `main` branch
- Node.js 22.16.0
- PostgreSQL 16 included
- Build command: `cd ../.. && pnpm install --frozen-lockfile && cd apps/api && npx prisma generate && npm run build`
- Start command: `npm run start`
- Live at: [https://discover-influencers-api.onrender.com](https://discover-influencers-api.onrender.com)

### Environment Variables (Production)

**Vercel (Frontend):**
```bash
NEXT_PUBLIC_API_URL=https://discover-influencers-api.onrender.com
```

**Render (Backend):**
```bash
NODE_ENV=production
DATABASE_URL=<Internal Database URL from Render>
JWT_ACCESS_SECRET=<Generated 32+ char secret>
JWT_REFRESH_SECRET=<Generated 32+ char secret>
CORS_ORIGIN=https://discover-influencers-web.vercel.app
LOG_TO_FILES=false
```

### Deployment Guides
- 🚀 **[Render Deployment](./.docs/deployment/RENDER_DEPLOYMENT.md)** - Complete step-by-step guide
- 🔄 **[Alternative Platforms](./.docs/deployment/ALTERNATIVE_PLATFORMS.md)** - Platform comparison

### Database Migrations (Production)

**Option A: From Local Machine (Free)**
```bash
cd apps/api
$env:DATABASE_URL="<External Database URL from Render>"
npx prisma migrate deploy
npm run db:seed
```

**Option B: Using Render Shell (Paid)**
- Requires Render paid plan
- Access via Render dashboard → Shell tab

## � Development Commands

### Monorepo Commands (from root)
```bash
pnpm dev           # Start both frontend & backend
pnpm build         # Build all apps
pnpm clean         # Remove node_modules and build artifacts
pnpm lint          # Run linters across all packages
```

### Frontend Commands
```bash
pnpm dev:web       # Start Next.js dev server (port 3000)
pnpm build:web     # Build Next.js app for production
pnpm start:web     # Start Next.js production server
```

### Backend Commands
```bash
pnpm dev:api       # Start Express.js dev server (port 5000)
pnpm build:api     # Build TypeScript to JavaScript
pnpm start:api     # Start Express.js production server
```

### Database Commands
```bash
cd apps/api

npx prisma migrate dev      # Create and apply migration
npx prisma migrate deploy   # Apply migrations (production)
npx prisma generate         # Generate Prisma Client
npx prisma studio           # Open Prisma Studio GUI
npm run db:seed             # Seed database with sample data
```

### Adding Dependencies
```bash
# Add to frontend
pnpm --filter web add <package>

# Add to backend
pnpm --filter api add <package>

# Add to root workspace
pnpm add -w <package>
```

## 📊 Project Stats

- **Lines of Code**: ~8,000+
- **Files**: 150+
- **Commits**: 30+
- **Development Time**: ~20-24 hours
- **Technologies**: 25+
- **Test Cases**: 78
- **API Endpoints**: 25+
- **Database Tables**: 4
- **UI Components**: 40+

## 🛠️ Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.3 | React framework with App Router |
| React | 19.0.0 (RC) | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.0.0 | Styling |
| Zustand | 5.0.3 | State management |
| Axios | 1.7.9 | HTTP client |
| Recharts | 2.15.0 | Data visualization |
| Lucide React | 0.469.0 | Icon library |
| shadcn/ui | Latest | UI components |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 5.1.0 | Web framework |
| Node.js | 22.16.0 | Runtime |
| TypeScript | 5.9.3 | Type safety |
| Prisma | 6.19.0 | ORM |
| PostgreSQL | 16 | Database |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 3.0.3 | Password hashing |
| Winston | 3.18.3 | Logging |
| Helmet | 8.1.0 | Security headers |
| express-rate-limit | 8.2.1 | Rate limiting |
| Jest | 29.7.0 | Testing framework |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| pnpm | Package manager & monorepo |
| Vercel | Frontend hosting |
| Render | Backend hosting + PostgreSQL |
| GitHub | Version control |
| ESLint | Code linting |
| Prettier | Code formatting |

## 🎯 Features Checklist

### ✅ Completed Features

**Authentication & Security:**
- [x] User registration with validation
- [x] JWT access + refresh token authentication
- [x] HTTP-only secure cookies
- [x] Password hashing with bcrypt
- [x] Role-based access control (ADMIN, EDITOR, VIEWER)
- [x] Protected routes and middleware
- [x] Session persistence
- [x] Rate limiting
- [x] CORS protection
- [x] Security headers (Helmet)

**Influencer Management:**
- [x] Create, read, update, delete influencers
- [x] Advanced search and filtering
- [x] Pagination with customizable limits
- [x] Category-based organization
- [x] Tier classification (NANO to MEGA)
- [x] Status management (ACTIVE, INACTIVE, PENDING)
- [x] Social media metrics tracking
- [x] Individual profile pages

**User Management:**
- [x] User CRUD operations (Admin only)
- [x] Role assignment
- [x] User search and filtering
- [x] Bulk user management

**Analytics & Reporting:**
- [x] Dashboard with key metrics
- [x] Category distribution charts
- [x] Tier breakdown visualization
- [x] Engagement rate statistics
- [x] Top performers list
- [x] Status overview

**UI/UX:**
- [x] Responsive design (mobile/tablet/desktop)
- [x] Dark theme with gradients
- [x] Loading states and skeletons
- [x] Error handling with user feedback
- [x] Smooth animations
- [x] Intuitive navigation

**Testing & Quality:**
- [x] Unit tests (29 passing)
- [x] Integration test templates (49)
- [x] TypeScript strict mode
- [x] ESLint configuration
- [x] Comprehensive documentation

**Deployment:**
- [x] Production deployment (Vercel + Render)
- [x] Environment configuration
- [x] Database migrations
- [x] Seed data
- [x] Health check endpoints
- [x] Auto-deploy on push

## 📦 Project Status

| Category | Status |
|----------|--------|
| **Development** | ✅ Complete |
| **Testing** | ✅ 29/29 unit tests passing |
| **Documentation** | ✅ Comprehensive |
| **Frontend Deployment** | ✅ Live on Vercel |
| **Backend Deployment** | ✅ Live on Render |
| **Database** | ✅ Migrated & Seeded |
| **Production Ready** | ✅ Yes |

**Last Updated**: November 11, 2025

## 📚 Additional Resources

- 📄 **[Full Submission Document](./.docs/SUBMISSION.md)** - Complete project details
- 📖 **[Setup Guide](./.docs/SETUP.md)** - Local development setup
- 🔌 **[API Documentation](./.docs/API_DOCUMENTATION.md)** - API reference
- 🚀 **[Render Deployment Guide](./.docs/deployment/RENDER_DEPLOYMENT.md)** - Production deployment
- 🔄 **[Platform Comparison](./.docs/deployment/ALTERNATIVE_PLATFORMS.md)** - Deployment options
- 📊 **[Project Summary](./.docs/PROJECT_SUMMARY.md)** - Overview and requirements

## 🤝 Contributing

This project was created as an assignment submission. For questions or feedback:

1. Open an issue on GitHub
2. Contact the repository owner
3. Review the submission document for detailed information

## 📧 Contact

- **Repository**: [github.com/peamz4/discover-influencers](https://github.com/peamz4/discover-influencers)
- **Submission**: See `.docs/SUBMISSION.md` for full details

## 🙏 Acknowledgments

- **Prime Media** - For the opportunity to work on this project
- **shadcn/ui** - For the beautiful UI components
- **Vercel** - For frontend hosting
- **Render** - For backend hosting and PostgreSQL

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

<div align="center">

**Built with ❤️ for Prime Media**

[Live Demo](https://discover-influencers-web.vercel.app) • [API](https://discover-influencers-api.onrender.com) • [Documentation](./.docs/SUBMISSION.md)

</div>
