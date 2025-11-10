# Prime Influencer Discovery Platform

A full-stack web application for discovering and managing influencers built as a **pnpm monorepo**.

## 📚 Documentation

**Complete documentation is available in the [`.docs/`](./.docs/) folder.**

### Quick Links
- 📖 **[Documentation Index](./.docs/README.md)** - Complete documentation overview
- 🚀 **[Deployment Guide](./.docs/deployment/INDEX.md)** - Deploy to Vercel
- ⚙️ **[Setup Guide](./.docs/setup/QUICKSTART.md)** - Quick start for local development
- 🔌 **[API Documentation](./.docs/api/API_DOCUMENTATION.md)** - Complete API reference
- 🏗️ **[Architecture](./.docs/architecture/ARCHITECTURE.md)** - System architecture & diagrams
- 📋 **[Project Summary](./.docs/PROJECT_SUMMARY.md)** - Complete project overview

## 🏗️ Architecture

### Monorepo Structure
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo ready
- **Shared Packages**: TypeScript configurations

### Frontend (apps/web)
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Features**: App Router, Server Components

### Backend (apps/api)
- **Framework**: Express.js
- **Language**: TypeScript
- **Runtime**: Node.js
- **Key Features**: RESTful API, CORS enabled

## 📁 Project Structure

```
discover-influencers/
├── apps/
│   ├── web/              # Next.js application (Frontend)
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utility functions
│   │   ├── public/       # Static assets
│   │   └── package.json
│   └── api/              # Express.js API (Backend)
│       ├── src/          # TypeScript source files
│       │   └── server.ts
│       ├── dist/         # Compiled JavaScript
│       └── package.json
├── packages/
│   └── typescript-config/ # Shared TypeScript configs
│       ├── base.json
│       ├── nextjs.json
│       └── node.json
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── package.json          # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)

Install pnpm globally if you haven't:
```bash
npm install -g pnpm
```

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd discover-influencers
```

2. Install all dependencies (from root)
```bash
pnpm install
```

This will install dependencies for all workspace packages.

### Running the Application

#### Run Both Frontend & Backend (Parallel)
```bash
pnpm dev
```

#### Run Frontend Only (Port 3000)
```bash
pnpm dev:web
```

The frontend will be available at `http://localhost:3000`

#### Run Backend Only (Port 5000)
```bash
pnpm dev:api
```

The API will be available at `http://localhost:5000`

## 🔧 Development

### Root-level Commands
- `pnpm dev` - Start all apps in development mode (parallel)
- `pnpm build` - Build all apps
- `pnpm clean` - Remove all node_modules and build artifacts
- `pnpm lint` - Run linters across all packages

### App-specific Commands
- `pnpm dev:web` - Start Next.js dev server
- `pnpm dev:api` - Start Express.js dev server
- `pnpm build:web` - Build Next.js app
- `pnpm build:api` - Build Express.js app
- `pnpm start:web` - Run Next.js production server
- `pnpm start:api` - Run Express.js production server

### Adding Dependencies

```bash
# Add to web app
pnpm --filter web add <package>

# Add to api app
pnpm --filter api add <package>

# Add to root (workspace-level)
pnpm add -w <package>
```

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Influencers
- `GET /api/influencers` - Get all influencers
- (More endpoints to be added)

## 📝 Environment Variables

### Backend (.env in apps/api)
```
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
REFRESH_TOKEN_SECRET="..."
CORS_ORIGIN="http://localhost:3000"
```

See [.docs/setup/SETUP.md](./.docs/setup/SETUP.md) for complete environment setup.

### Frontend (.env.local in apps/web)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📚 Additional Documentation

For detailed information, see the `.docs/` folder:

- **Setup & Configuration**: [.docs/setup/](./.docs/setup/)
- **API Documentation**: [.docs/api/](./.docs/api/)
- **Deployment Guides**: [.docs/deployment/](./.docs/deployment/)
- **Architecture**: [.docs/architecture/](./.docs/architecture/)

## 🛠️ Tech Stack

**Monorepo:**
- pnpm workspaces
- Shared TypeScript configurations

**Frontend (apps/web):**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand (state management)
- React Query
- ESLint

**Backend (apps/api):**
- Express.js
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcryptjs
- Winston (logging)
- Helmet.js (security)
- Jest + Supertest (testing)
- Node.js
- CORS
- dotenv
- ts-node & nodemon (development)

## 🎯 Features

- ✅ User authentication (JWT with refresh tokens)
- ✅ Role-based access control (Admin, Editor, Viewer)
- ✅ Influencer CRUD operations
- ✅ User management
- ✅ Category management
- ✅ Advanced search and filtering
- ✅ Pagination
- ✅ Responsive design
- ✅ Dark theme UI
- ✅ Public discovery page
- ✅ Comprehensive test suite
- ✅ Production-ready deployment config

## 📦 Project Status

✅ **Development**: Complete  
✅ **Testing**: 34/34 tests passing  
✅ **Documentation**: Comprehensive  
✅ **Deployment Ready**: Configured for Vercel  

See [.docs/ASSIGNMENT_CHECKLIST.md](./.docs/ASSIGNMENT_CHECKLIST.md) for detailed requirements verification.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
