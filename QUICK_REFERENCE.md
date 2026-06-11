# Quick Reference Guide

## Project Info
- **Name**: ReferAI
- **Version**: 1.0.0 (Phase 0 - Foundation)
- **Location**: D:\ReferAI
- **Status**: ✅ Foundation Complete

## Critical Files
| File | Purpose |
|------|---------|
| `setup.sh` | One-command initialization |
| `CLAUDE.md` | Project documentation |
| `docs/ARCHITECTURE.md` | System design |
| `docker-compose.yml` | Service orchestration |
| `backend/pom.xml` | Maven dependencies |
| `frontend/package.json` | NPM dependencies |

## Service URLs
| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend | http://localhost:8080 | - |
| Swagger | http://localhost:8080/swagger-ui.html | - |
| Database | localhost:5432 | referai_user / dev_password |
| Redis | localhost:6379 | - |

## Common Commands

### Setup & Start
```bash
bash setup.sh                          # One-command setup
docker-compose -f docker/docker-compose.yml up -d    # Start services
docker-compose -f docker/docker-compose.yml ps       # View status
```

### Development
```bash
# Backend
cd backend && mvn spring-boot:run      # Run locally
mvn test                               # Run tests
mvn clean install                      # Build

# Frontend
cd frontend && npm install             # Install deps
npm run dev                            # Dev server
npm run build                          # Production build
npm run lint                           # Check code
npm test                               # Run tests
```

### Database
```bash
psql -h localhost -U referai_user -d referai          # Connect
docker-compose exec postgres psql -U referai_user -d referai  # Via Docker
```

### Logs
```bash
docker-compose logs -f                 # All services
docker-compose logs -f backend         # Backend only
tail -f /d/ReferAI/logs/app.log       # Application log
```

### Cleanup
```bash
docker-compose down                    # Stop services
docker-compose down -v                 # Stop + remove volumes (reset DB)
docker-compose build --no-cache        # Rebuild images
```

## Git Workflow
```bash
git checkout -b feature/name           # New branch
git add .                              # Stage changes
git commit -m "feat: description"      # Commit
git push origin feature/name           # Push
```

## Configuration
- **Development**: Copy `.env.dev` to `.env`
- **Production**: Use secrets management (AWS Secrets Manager)
- **Profiles**: dev (debug logging), prod (minimal logging)

## Database Tables (21 Total)
- Users: 3 tables
- Candidates: 5 tables
- Employees: 1 table
- Recruiters: 1 table
- Core: 3 tables
- Gamification: 4 tables
- Social: 2 tables
- Content: 4 tables
- Admin: 1 table

## Key Dependencies
**Backend**: Spring Boot 3.2, JWT, OAuth2, PostgreSQL, Redis
**Frontend**: React 18, TypeScript, Redux, Tailwind, ShadCN UI

## Next Phase: Phase 1
Focus: Authentication + User Profiles
- JWT + OAuth implementation
- Login/registration flows
- Profile management
- Basic dashboard

## Support
- Docs: `/d/ReferAI/docs/`
- Issues: Check logs and documentation
- Questions: Refer to CLAUDE.md

---

**Last Updated**: 2026-01-01  
**Phase**: 0 - Foundation Complete
