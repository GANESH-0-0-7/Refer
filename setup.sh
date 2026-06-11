#!/bin/bash

# ReferAI Setup Script
# One-command initialization of the complete development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║         ReferAI - Development Setup               ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

# Check prerequisites
echo -e "\n${YELLOW}→ Checking prerequisites...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 is not installed${NC}"
        echo "  Please install $2"
        exit 1
    else
        echo -e "${GREEN}✓ $1 found${NC}"
    fi
}

check_command "docker" "Docker (https://www.docker.com/products/docker-desktop)"
check_command "docker-compose" "Docker Compose"
check_command "git" "Git (https://git-scm.com)"

# Initialize Git
echo -e "\n${YELLOW}→ Initializing Git repository...${NC}"
if [ ! -d "$PROJECT_ROOT/.git" ]; then
    cd "$PROJECT_ROOT"
    git init
    git config user.name "ReferAI Developer"
    git config user.email "dev@referai.com"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already initialized${NC}"
fi

# Setup environment files
echo -e "\n${YELLOW}→ Setting up environment files...${NC}"

if [ ! -f "$PROJECT_ROOT/.env" ]; then
    cp "$PROJECT_ROOT/.env.dev" "$PROJECT_ROOT/.env"
    echo -e "${GREEN}✓ Created .env from .env.dev${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

if [ ! -f "$PROJECT_ROOT/frontend/.env" ]; then
    cp "$PROJECT_ROOT/frontend/.env.example" "$PROJECT_ROOT/frontend/.env"
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${GREEN}✓ frontend/.env already exists${NC}"
fi

# Create necessary directories
echo -e "\n${YELLOW}→ Creating data directories...${NC}"
mkdir -p "$PROJECT_ROOT/{postgres_data,redis_data,uploads,logs}"
echo -e "${GREEN}✓ Directories created${NC}"

# Start Docker services
echo -e "\n${YELLOW}→ Starting Docker services...${NC}"
echo "  This may take a few minutes on first run..."

cd "$PROJECT_ROOT"

# Use docker-compose from docker/ directory
docker-compose -f docker/docker-compose.yml down -v 2>/dev/null || true
docker-compose -f docker/docker-compose.yml up -d

echo -e "${GREEN}✓ Docker services started${NC}"

# Wait for services to be healthy
echo -e "\n${YELLOW}→ Waiting for services to be healthy...${NC}"
sleep 10

max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -U referai_user &>/dev/null; then
        echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
        break
    fi
    echo "  Attempt $attempt/$max_attempts..."
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    exit 1
fi

# Check all services
echo -e "\n${YELLOW}→ Verifying all services...${NC}"
docker-compose -f docker/docker-compose.yml ps

# Display service URLs
echo -e "\n${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                Setup Complete! 🎉                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}Services are running at:${NC}"
echo -e "  ${BLUE}Frontend${NC}       → ${YELLOW}http://localhost:3000${NC}"
echo -e "  ${BLUE}Backend API${NC}    → ${YELLOW}http://localhost:8080${NC}"
echo -e "  ${BLUE}Swagger Docs${NC}   → ${YELLOW}http://localhost:8080/swagger-ui.html${NC}"
echo -e "  ${BLUE}PostgreSQL${NC}     → ${YELLOW}localhost:5432${NC}"
echo -e "  ${BLUE}Redis${NC}          → ${YELLOW}localhost:6379${NC}"

echo -e "\n${GREEN}Database Credentials:${NC}"
echo -e "  ${BLUE}Username${NC}: referai_user"
echo -e "  ${BLUE}Database${NC}: referai"

echo -e "\n${GREEN}Next Steps:${NC}"
echo -e "  1. ${YELLOW}Backend (local development):${NC}"
echo -e "     cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev"
echo -e "\n  2. ${YELLOW}Frontend (local development):${NC}"
echo -e "     cd frontend && npm install && npm run dev"
echo -e "\n  3. ${YELLOW}View logs:${NC}"
echo -e "     docker-compose -f docker/docker-compose.yml logs -f backend"

echo -e "\n${GREEN}Documentation:${NC}"
echo -e "  - Architecture: ${YELLOW}docs/ARCHITECTURE.md${NC}"
echo -e "  - Database:    ${YELLOW}docs/DATABASE.md${NC}"
echo -e "  - Setup Guide: ${YELLOW}CLAUDE.md${NC}"

echo -e "\n${YELLOW}⚠  First time setup - Running database migrations...${NC}"
docker-compose -f docker/docker-compose.yml exec -T backend curl http://localhost:8080/health 2>/dev/null || true

echo -e "\n${GREEN}✓ Setup complete! You're ready to start developing.${NC}"
echo -e "${BLUE}Happy coding! 🚀${NC}\n"
