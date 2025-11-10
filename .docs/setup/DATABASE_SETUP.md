# Database Setup Instructions

## Option 1: Using Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running

### Steps
```bash
# Start the database
docker-compose -f docker-compose.dev.yml up -d

# Verify it's running
docker ps

# View logs
docker-compose -f docker-compose.dev.yml logs postgres
```

### Access
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`
  - Email: `admin@primeinfluencer.com`
  - Password: `admin`

## Option 2: Local PostgreSQL Installation

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with these settings:
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: postgres

3. Create database:
```sql
CREATE DATABASE prime_influencer;
```

### macOS (using Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb prime_influencer
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb prime_influencer
```

## Running Migrations

Once the database is running:

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Seed the database
npm run db:seed
```

## Verify Setup

```bash
# Open Prisma Studio to view data
npx prisma studio

# Or connect with psql
psql -h localhost -U postgres -d prime_influencer
```

## Connection String

Update `.env` if needed:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prime_influencer?schema=public"
```

## Troubleshooting

### Docker not starting
- Ensure Docker Desktop is running
- Check Docker service: `docker --version`

### Connection refused
- Verify PostgreSQL is running
- Check port 5432 is not in use: `netstat -an | findstr 5432`
- Verify credentials in `.env`

### Migration fails
- Ensure database exists
- Check DATABASE_URL is correct
- Try: `npx prisma db push` as alternative to migrate

### Seed fails
- Run migrations first
- Check database is empty or drop tables
- Verify Prisma client is generated
