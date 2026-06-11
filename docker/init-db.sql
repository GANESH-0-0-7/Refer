-- PostgreSQL initialization script
-- This script runs when the PostgreSQL container starts
-- It creates extensions needed for ReferAI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable JSON/JSONB support (already built-in, no extension needed)

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schema
CREATE SCHEMA IF NOT EXISTS public;

-- Grant privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO ${POSTGRES_USER};

-- Set search path
ALTER USER ${POSTGRES_USER} SET search_path TO public;
