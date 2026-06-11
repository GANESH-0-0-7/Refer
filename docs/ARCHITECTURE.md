# ReferAI System Architecture

## Overview

ReferAI is a full-stack AI career ecosystem built with a modular monolith backend that scales to microservices.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  React Frontend  │    │  Flutter Mobile  │              │
│  │   (Port 5173)    │    │  (Port 5000)     │              │
│  └──────────────────┘    └──────────────────┘              │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/WSS
┌──────────────────────────┴──────────────────────────────────┐
│                  API GATEWAY LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Nginx Reverse Proxy (Port 80/443)           │   │
│  │  - Rate Limiting                                   │   │
│  │  - SSL/TLS Termination                             │   │
│  │  - Request Routing                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
┌──────────────────────────┴──────────────────────────────────┐
│              APPLICATION LAYER (Spring Boot)                │
│                      (Port 8080)                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  API Controllers & REST Endpoints                 │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  Service Layer (Business Logic)                   │    │
│  │  ├── AuthService          ├── CandidateService   │    │
│  │  ├── UserService          ├── EmployeeService    │    │
│  │  ├── ResumeService        ├── ReferralService    │    │
│  │  ├── InterviewService     └── AnalyticsService   │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  Security Layer (JWT, OAuth2, RBAC)              │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼──────┐  ┌──────▼──────┐
│  PostgreSQL    │  │   Redis     │  │  Flyway    │
│  Database      │  │  Cache      │  │ Migrations │
│  (Port 5432)   │  │ (Port 6379) │  │            │
└────────────────┘  └─────────────┘  └────────────┘
```

## Service Boundaries

The backend is organized as a modular monolith with clear domain boundaries:

### Authentication Service
- JWT token generation and validation
- OAuth 2.0 (Google, GitHub)
- Role-based access control (RBAC)
- Refresh token management
- **Endpoints**: `/api/v1/auth/*`

### User Service
- User registration and profile management
- Role assignment
- User status management
- **Endpoints**: `/api/v1/users/*`

### Candidate Service
- Candidate profile (education, skills, experience)
- Career rating calculation
- Profile completeness tracking
- **Endpoints**: `/api/v1/candidates/*`

### Employee Service
- Employee profile management
- Company verification
- Referral history tracking
- **Endpoints**: `/api/v1/employees/*`

### Recruiter Service
- Recruiter profile and company verification
- Job posting management
- Candidate search and filtering
- **Endpoints**: `/api/v1/recruiters/*`

### Resume Service
- Resume upload and storage
- PDF parsing
- ATS scoring
- Skill extraction
- **Endpoints**: `/api/v1/resumes/*`

### Interview Service
- Mock interview management
- Interview scoring
- Feedback generation
- Transcription storage
- **Endpoints**: `/api/v1/interviews/*`

### Referral Service
- Referral request creation and tracking
- Referral pipeline management
- Referral outcome tracking
- **Endpoints**: `/api/v1/referrals/*`

### Analytics Service
- XP point calculation
- Streak tracking
- Achievement management
- Global ranking calculation
- **Endpoints**: `/api/v1/analytics/*`

## Data Flow

### Authentication Flow
```
User Input → Nginx → Spring Security Filter → JWT Provider → AuthService → Database
                                            ↓
                                      Token Generation
```

### Resume Upload Flow
```
Frontend → Nginx → Controller → ResumeService → PDF Parser → AI Analysis → Database/Redis
```

### Referral Flow
```
Candidate Request → Nginx → Controller → ReferralService → Employee Notification → 
Database Update → Analytics Trigger → XP Calculation
```

## Technology Stack Details

### Frontend (React 18 + TypeScript)
- **State Management**: Redux Toolkit (global), React Query (server state)
- **UI Components**: ShadCN UI (Radix UI based)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6

### Backend (Spring Boot 3.2 + Java 21)
- **Framework**: Spring Web MVC
- **Database Access**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT + OAuth2
- **Database Migration**: Flyway
- **Caching**: Spring Cache + Redis
- **Documentation**: SpringDoc OpenAPI (Swagger 3.0)
- **Async Processing**: Spring's @Async

### Database (PostgreSQL 16)
- 21 core tables for MVP
- JSONB columns for flexible data (scores, feedback)
- Full-text search support (pg_trgm extension)
- Indexes on frequently queried columns
- Foreign key constraints for referential integrity

### Caching (Redis 7)
- Session storage
- Token blacklisting
- User data caching
- Rate limiting counters

## Scaling Strategy

### Monolith → Microservices
1. **Current**: Modular monolith with clear domain boundaries
2. **Phase 1**: Extract auth service (handles OAuth/JWT)
3. **Phase 2**: Extract resume + interview services (heavy AI processing)
4. **Phase 3**: Extract analytics service (independent calculations)

Each service would have:
- Separate Spring Boot instance
- Shared PostgreSQL (can be split per service)
- Event bus for inter-service communication (Kafka/RabbitMQ)
- API Gateway (Kong, AWS API Gateway)

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│          Docker Compose (Development)           │
│  ┌────────────────┐  ┌──────────────────────┐  │
│  │ PostgreSQL     │  │ Redis                │  │
│  │ Backend        │  │ Backend              │  │
│  │ Frontend       │  │ Frontend             │  │
│  │ Nginx          │  │ Nginx                │  │
│  └────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│    Kubernetes (Production - Future)             │
│  ┌────────────────┐  ┌──────────────────────┐  │
│  │ Backend Pods   │  │ Database RDS         │  │
│  │ Frontend       │  │ ElastiCache (Redis)  │  │
│  │ Load Balancer  │  │ ALB/API Gateway      │  │
│  └────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Security Architecture

- **Authentication**: JWT with 24-hour expiry + 7-day refresh token
- **Authorization**: Role-based access control (RBAC) at service layer
- **Encryption**: TLS 1.2+ for transit, AES-256 for sensitive data
- **Input Validation**: Bean Validation on all endpoints
- **CORS**: Strict origin allowlist
- **Rate Limiting**: Nginx-level + application-level
- **Audit Logging**: All sensitive operations logged

## Error Handling

```json
{
  "statusCode": 400,
  "message": "Invalid request",
  "timestamp": "2026-01-01T12:00:00Z",
  "path": "/api/v1/users",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

## API Versioning Strategy

- Current: `/api/v1/*`
- Maintain backward compatibility
- Deprecation warnings in response headers
- Migration guides in documentation

---

For detailed API specifications, see [API_SPEC.md](API_SPEC.md)
For database schema details, see [DATABASE.md](DATABASE.md)
