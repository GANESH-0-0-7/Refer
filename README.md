# ReferAI - Ultimate AI Career Ecosystem

**ReferAI** is a production-ready, startup-grade AI-powered career growth platform combining the best features of LinkedIn, LeetCode, Duolingo, Discord, and Glassdoor.

## 🎯 Features

- **AI Resume Analyzer** - ATS scoring, skill extraction, improvement suggestions
- **AI Mock Interviews** - Technical, behavioral, HR interviews with AI feedback
- **Referral Marketplace** - Connect candidates with employees for referrals
- **AI Matching Engine** - Smart matching of candidates, jobs, mentors, and learning paths
- **Gamification** - XP, streaks, badges, global rankings
- **Learning Hub** - Personalized learning recommendations
- **Video Mentorship** - 1-on-1 sessions with screen sharing
- **Community Platform** - Videos, articles, placement stories, interview experiences

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS + ShadCN UI
- **Backend**: Spring Boot 3.2 + Java 21
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Deployment**: Docker + Docker Compose + GitHub Actions

## 📂 Project Structure

```
ReferAI/
├── backend/          Spring Boot backend (modular monolith)
├── frontend/         React TypeScript frontend
├── mobile/           Flutter mobile app
├── docker/           Docker configuration
├── db/               Database schema & migrations
└── docs/             Architecture & technical documentation
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 21 (for local backend development)
- Node.js 18+ (for local frontend development)

### Setup
```bash
cd /d/ReferAI
bash setup.sh
```

This will:
1. Initialize all services
2. Create databases and run migrations
3. Start Docker containers
4. Seed development data

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📚 Documentation

- [Architecture Design](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [API Specification](docs/API_SPEC.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Setup](docs/DEVELOPMENT.md)
- [Security Policies](docs/SECURITY.md)

## 🔄 Development Workflow

### Backend Development
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Docker Development
```bash
docker-compose up
```

## 📊 Phases

- **Phase 0** ✅ Architecture & Foundation
- **Phase 1** - Authentication & Core Profiles
- **Phase 2** - AI Resume Analyzer & Mock Interviews
- **Phase 3** - Referral Marketplace
- **Phase 4** - Gamification & Rankings
- **Phase 5** - Learning Hub
- **Phase 6** - Advanced Features

## 🔐 Security

- JWT Authentication with refresh tokens
- OAuth 2.0 (Google, GitHub)
- Role-Based Access Control (RBAC)
- Encrypted sensitive data
- Audit logging
- Rate limiting

## 📄 License

Proprietary - ReferAI

## 👥 Contributors

ReferAI Team

---

For questions or support, refer to the documentation or contact the development team.
