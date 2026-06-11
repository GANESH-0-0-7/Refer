# ReferAI Project Documentation

This document provides context for Claude and future developers working on ReferAI.

## Project Overview

**ReferAI** is a full-stack AI career ecosystem that combines LinkedIn, LeetCode, Duolingo, Discord, and Glassdoor into a single platform focused on:
- Career growth and skill development
- Job referrals and hiring
- Interview preparation
- Networking and mentorship
- Community learning

## Technology Stack

### Frontend
- React 18 + TypeScript 5
- Vite (bundler)
- Tailwind CSS + ShadCN UI
- Redux Toolkit (state management)
- React Query (data fetching)
- Framer Motion (animations)
- Axios (API client)

### Backend
- Java 21
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- Maven (build tool)
- Flyway (database migrations)

### Infrastructure
- PostgreSQL 16 (primary database)
- Redis 7 (caching, sessions)
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

## Architecture Philosophy

### Monolith with Domain Boundaries
The backend starts as a modular Spring Boot monolith organized by feature domains:
- Auth Service
- User Service
- Profile Service
- Resume Service
- Interview Service
- Referral Service
- Analytics Service
- Content Service

**Rationale**: Easier to manage initially; can be extracted to microservices later without architectural changes.

### Database Strategy
- Shared PostgreSQL database (can be split per service later)
- Optimized indexes on frequently queried columns
- Referential integrity via foreign keys
- Audit logging for compliance

### Frontend State Management
- Redux Toolkit for global state (auth, user data)
- React Query for server state (API data)
- Component state for UI-only concerns (modals, forms)

## Project Directory Structure

```
/d/ReferAI/
├── backend/              # Spring Boot application
│   ├── pom.xml          # Maven dependencies
│   ├── src/main/java    # Application code
│   ├── src/main/resources
│   │   ├── application.yml
│   │   ├── db/migration # SQL migrations
│   │   └── db/schema.sql
│   └── src/test         # Unit & integration tests

├── frontend/            # React application
│   ├── package.json     # NPM dependencies
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Route-based pages
│   │   ├── services/    # API client
│   │   ├── store/       # Redux state
│   │   └── types/       # TypeScript types
│   └── public/          # Static assets

├── docker/              # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   └── init-db.sql

├── db/                  # Database assets
│   ├── schema.sql       # Complete schema
│   ├── migrations/      # Versioned migrations
│   └── seed-data.sql    # Development data

├── docs/                # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API_SPEC.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── SECURITY.md
│   ├── UML_DIAGRAMS.md
│   └── SEQUENCE_DIAGRAMS.md

└── .github/workflows/   # CI/CD pipelines
```

## Key Development Rules

### Code Style
- Backend: Google Java Style Guide
- Frontend: ESLint + Prettier
- Use meaningful variable and function names
- Keep functions focused and small
- Add comments only for non-obvious logic

### Database
- All paths in environment variables (not hardcoded)
- Use migrations for schema changes (Flyway)
- Add indexes on frequently queried columns
- Use foreign keys for referential integrity

### API Design
- RESTful design principles
- Standard HTTP methods and status codes
- Consistent error response format
- Pagination support (limit, offset)
- API versioning (/api/v1/)

### Frontend
- Component-based architecture
- Props over prop drilling (use Context/Redux)
- Custom hooks for logic reuse
- TypeScript for type safety
- Mobile-first responsive design

### Security
- JWT authentication with refresh tokens
- Never store secrets in code (use .env)
- SQL injection protection (JPA parameterized queries)
- XSS protection (React auto-escapes)
- CORS configuration for frontend domain
- Rate limiting on API endpoints

## Development Workflow

### Local Development
1. Clone the repository
2. Run `bash setup.sh` to initialize everything
3. Backend runs on http://localhost:8080
4. Frontend runs on http://localhost:3000
5. API docs at http://localhost:8080/swagger-ui.html

### Making Changes
1. Create a feature branch
2. Make changes to backend/frontend/db as needed
3. Run tests locally
4. Commit with descriptive messages
5. Push and create a pull request

### Database Changes
1. Create migration file in backend/src/main/resources/db/migration/
2. Naming: V{version}__{description}.sql (e.g., V2__add_user_bio.sql)
3. Flyway runs migrations automatically on startup
4. Never modify applied migrations

## Configuration Management

### Environment Variables
See `.env.example` for all required variables.

**Development**: Uses .env.dev (Docker/local development)
**Production**: Uses secrets management system (AWS Secrets Manager, etc.)

### Profiles
- `dev`: Development environment (debug logging, relaxed security)
- `prod`: Production environment (no debug, all security features)

## Testing Strategy

### Backend Tests
- Unit tests with JUnit 5
- Integration tests with TestContainers
- Test database in Docker
- Coverage target: > 70%

### Frontend Tests
- Component tests with Vitest
- Snapshot tests for UI consistency
- Integration tests for flows
- E2E tests with Playwright

## Common Tasks

### Adding a New API Endpoint
1. Create controller in appropriate package
2. Add service/repository classes
3. Update Swagger annotations
4. Add tests
5. Document in API_SPEC.md

### Adding a New Frontend Page
1. Create component in pages/
2. Add route in App.tsx
3. Create Redux slice if needed
4. Add API service calls
5. Add styles with Tailwind

### Deploying to Production
1. All tests must pass
2. Code review required
3. Create release tag
4. GitHub Actions deploys automatically

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker ps`
- Check .env variables are set correctly
- Check port 8080 is available

### Frontend build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Docker issues
- Rebuild images: `docker-compose build --no-cache`
- Reset volumes: `docker-compose down -v`

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Next Steps

1. Phase 1: Authentication & Core Profiles
2. Phase 2: AI Resume Analyzer & Mock Interviews
3. Phase 3: Referral Marketplace
4. Phase 4: Gamification & Rankings
5. Phase 5: Learning Hub

---

For questions, refer to the technical documentation in the `/docs` directory.
