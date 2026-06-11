# ReferAI Development Setup Guide

## Quick Start (One Command)

```bash
cd /d/ReferAI
bash setup.sh
```

This script will:
- Initialize git repository
- Setup environment files
- Start Docker containers
- Verify all services are healthy
- Display service URLs

## Manual Setup (Step by Step)

### 1. Prerequisites

Ensure you have installed:
- Docker & Docker Compose
- Git
- Java 21 (for local backend development)
- Node.js 18+ (for local frontend development)

### 2. Clone Repository

```bash
cd /d/ReferAI
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 3. Environment Configuration

```bash
cp .env.dev .env
cp frontend/.env.example frontend/.env
```

Edit `.env` if you need to override defaults (usually not needed for local dev).

### 4. Create Data Directories

```bash
mkdir -p postgres_data redis_data uploads logs
```

### 5. Start Docker Services

```bash
cd docker
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

All services should show "healthy" or "up" status.

### 6. Local Backend Development (Optional)

If you want to run the backend locally without Docker:

```bash
cd backend
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### 7. Local Frontend Development (Optional)

If you want to run the frontend locally with hot reload:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## Service URLs

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:8080 | Spring Boot REST API |
| Swagger Docs | http://localhost:8080/swagger-ui.html | Interactive API docs |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

## Database Access

### Using psql (Command Line)

```bash
psql -h localhost -U referai_user -d referai
# Password: dev_password (from .env.dev)
```

### Common Commands

```sql
-- List tables
\dt

-- Describe table schema
\d users

-- Query data
SELECT * FROM users LIMIT 10;

-- Exit
\q
```

### Using Docker

```bash
docker-compose -f docker/docker-compose.yml exec postgres psql -U referai_user -d referai
```

## Viewing Logs

### Docker Logs

```bash
# All services
docker-compose -f docker/docker-compose.yml logs -f

# Specific service
docker-compose -f docker/docker-compose.yml logs -f backend

# Last 100 lines
docker-compose -f docker/docker-compose.yml logs --tail=100 backend
```

### Application Logs

```bash
# Backend logs
tail -f /d/ReferAI/logs/app.log

# Frontend console (in browser DevTools)
Press F12 → Console tab
```

## Stopping Services

```bash
# Stop all services
cd /d/ReferAI/docker
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

## Rebuilding Services

```bash
# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d

# Wait for health checks
sleep 15
docker-compose ps
```

## Common Issues

### PostgreSQL Connection Refused

```bash
# Check if container is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Frontend not loading

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend throwing 500 errors

```bash
# Check backend logs
docker-compose logs -f backend

# Check database connection
docker-compose exec postgres pg_isready -U referai_user
```

### Port already in use

```bash
# Find process using port (example: 8080)
lsof -i :8080

# Kill process (replace PID)
kill -9 <PID>

# Or change port in docker-compose.yml
```

## Development Workflow

### 1. Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Backend Changes

```bash
cd backend

# Build and run tests
mvn clean install

# Run locally
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Frontend Changes

```bash
cd frontend

# Run with hot reload
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### 4. Database Schema Changes

Create a new Flyway migration:

```bash
# Create file: backend/src/main/resources/db/migration/V{number}__{description}.sql
# Example: V2__add_user_bio.sql

-- Migration content
ALTER TABLE users ADD COLUMN bio TEXT;
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

## Testing

### Backend Unit Tests

```bash
cd backend
mvn test
```

### Backend Integration Tests

```bash
cd backend
mvn verify
```

### Frontend Tests

```bash
cd frontend
npm test
npm test -- --ui  # with UI
```

### End-to-End Tests (Future)

```bash
npm run test:e2e
```

## Code Quality

### Backend

```bash
# Run linting
mvn checkstyle:check

# SonarQube analysis
mvn sonar:sonar
```

### Frontend

```bash
npm run lint
npm run type-check
```

## Performance Profiling

### Backend

```bash
# Enable verbose logging
export LOG_LEVEL=DEBUG

# Check slow queries (PostgreSQL)
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

### Frontend

```bash
# Open Chrome DevTools
F12 → Performance tab → Record
```

## Debugging

### Backend

```bash
# Add breakpoint in IDE
# Run with debug flag
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dagentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
```

### Frontend

```bash
# Add debugger in code
debugger;

# Or use DevTools
F12 → Sources tab → Set breakpoint
```

## IDE Setup

### VS Code

```bash
# Recommended extensions
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
- REST Client
```

### IntelliJ IDEA / WebStorm

```bash
# Settings
- Enable EditorConfig
- Configure Run Configuration for Spring Boot
- Configure Run Configuration for Node/Vite
```

## Useful Commands

```bash
# Format code
npm run lint -- --fix          # Frontend
mvn fmt:format                 # Backend (if configured)

# Update dependencies
npm update                      # Frontend
mvn dependency:update-properties # Backend

# Database dump
docker-compose exec postgres pg_dump -U referai_user referai > backup.sql

# Database restore
docker-compose exec -T postgres psql -U referai_user referai < backup.sql
```

## Git Hooks (Optional)

Pre-commit hook to lint before committing:

```bash
#!/bin/bash
# .git/hooks/pre-commit

cd frontend && npm run lint
cd ../backend && mvn checkstyle:check
```

## Support & Documentation

- [Architecture Documentation](../docs/ARCHITECTURE.md)
- [Database Documentation](../docs/DATABASE.md)
- [Security Policies](../docs/SECURITY.md)
- [Project Documentation](../CLAUDE.md)

---

For more help, check the logs or refer to the documentation.
