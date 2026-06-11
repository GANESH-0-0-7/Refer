-- Flyway Migration: V1__initial_schema.sql
-- Initial database schema for ReferAI
-- Created: 2026-01-01

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT status_check CHECK (status IN ('active', 'inactive', 'suspended', 'deleted'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_check CHECK (role IN ('candidate', 'employee', 'recruiter', 'mentor', 'admin'))
);

CREATE UNIQUE INDEX idx_user_roles_unique ON user_roles(user_id, role);
CREATE INDEX idx_user_roles_role ON user_roles(role);

CREATE TABLE oauth_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT provider_check CHECK (provider IN ('google', 'github'))
);

CREATE INDEX idx_oauth_tokens_user_id ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_provider ON oauth_tokens(provider);

-- ============================================================================
-- CANDIDATE PROFILE
-- ============================================================================

CREATE TABLE candidates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    career_rating DECIMAL(5,2) DEFAULT 0,
    global_rank BIGINT,
    country_rank BIGINT,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0,
    xp_points BIGINT DEFAULT 0,
    profile_completion_percentage INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_career_rating ON candidates(career_rating DESC);
CREATE INDEX idx_candidates_global_rank ON candidates(global_rank);
CREATE INDEX idx_candidates_xp_points ON candidates(xp_points DESC);

CREATE TABLE candidate_education (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    school VARCHAR(255) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE,
    grade VARCHAR(10),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_education_candidate_id ON candidate_education(candidate_id);

CREATE TABLE candidate_skills (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(20) NOT NULL,
    endorsed_count INT DEFAULT 0,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT proficiency_check CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

CREATE INDEX idx_skills_candidate_id ON candidate_skills(candidate_id);
CREATE INDEX idx_skills_skill_name ON candidate_skills(skill_name);

CREATE TABLE candidate_experience (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    duration_months INT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    currently_working BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_experience_candidate_id ON candidate_experience(candidate_id);

CREATE TABLE candidate_projects (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_url TEXT,
    demo_url TEXT,
    technologies_used TEXT[],
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_candidate_id ON candidate_projects(candidate_id);

-- ============================================================================
-- EMPLOYEE PROFILE
-- ============================================================================

CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_id BIGINT,
    department VARCHAR(100),
    job_title VARCHAR(100),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'unverified',
    reputation_score DECIMAL(5,2) DEFAULT 0,
    total_referrals_made INT DEFAULT 0,
    successful_referrals INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT verification_check CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'))
);

CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_verification_status ON employees(verification_status);

-- ============================================================================
-- RECRUITER PROFILE
-- ============================================================================

CREATE TABLE recruiters (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'unverified',
    available_positions INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recruiters_company_id ON recruiters(company_id);
CREATE INDEX idx_recruiters_active ON recruiters(active);

-- ============================================================================
-- CORE FEATURES
-- ============================================================================

CREATE TABLE resumes (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    ats_score DECIMAL(5,2),
    resume_score DECIMAL(5,2),
    skill_matrix_json JSONB,
    improvement_suggestions JSONB,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    analyzed_at TIMESTAMP
);

CREATE INDEX idx_resumes_candidate_id ON resumes(candidate_id);
CREATE INDEX idx_resumes_ats_score ON resumes(ats_score DESC);

CREATE TABLE interviews (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    interviewer_id BIGINT REFERENCES users(id),
    interview_type VARCHAR(50) NOT NULL,
    interview_mode VARCHAR(50) NOT NULL,
    transcript TEXT,
    scores_json JSONB,
    feedback_json JSONB,
    duration_minutes INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT type_check CHECK (interview_type IN ('technical', 'behavioral', 'hr', 'system_design')),
    CONSTRAINT mode_check CHECK (interview_mode IN ('text', 'voice', 'video'))
);

CREATE INDEX idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX idx_interviews_interviewer_id ON interviews(interviewer_id);
CREATE INDEX idx_interviews_interview_type ON interviews(interview_type);
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);

CREATE TABLE referrals (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    company_id BIGINT,
    job_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'requested',
    outcome VARCHAR(50),
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status_check CHECK (status IN ('requested', 'pending', 'accepted', 'rejected', 'applied', 'interviewing', 'offer', 'hired', 'closed')),
    CONSTRAINT outcome_check CHECK (outcome IN ('hired', 'rejected', 'passed', 'pending', NULL))
);

CREATE INDEX idx_referrals_candidate_id ON referrals(candidate_id);
CREATE INDEX idx_referrals_employee_id ON referrals(employee_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_company_id ON referrals(company_id);
CREATE INDEX idx_referrals_created_at ON referrals(created_at DESC);

-- ============================================================================
-- GAMIFICATION
-- ============================================================================

CREATE TABLE user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255),
    description TEXT,
    icon_url TEXT,
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_achievements_earned_at ON user_achievements(earned_at DESC);

CREATE TABLE user_streaks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_xp_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp_amount INT NOT NULL,
    activity_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT activity_type_check CHECK (activity_type IN ('interview', 'referral', 'learning', 'content_creation', 'achievement'))
);

CREATE INDEX idx_xp_history_user_id ON user_xp_history(user_id);
CREATE INDEX idx_xp_history_created_at ON user_xp_history(created_at DESC);

CREATE TABLE user_ranks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    global_rank BIGINT,
    country_rank BIGINT,
    tier VARCHAR(50) NOT NULL,
    points BIGINT DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tier_check CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster'))
);

CREATE INDEX idx_ranks_global_rank ON user_ranks(global_rank);
CREATE INDEX idx_ranks_tier ON user_ranks(tier);
CREATE INDEX idx_ranks_points ON user_ranks(points DESC);

-- ============================================================================
-- SOCIAL
-- ============================================================================

CREATE TABLE followers (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    CONSTRAINT unique_follow UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);

CREATE TABLE user_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    billing_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT plan_type_check CHECK (plan_type IN ('free', 'premium_candidate', 'premium_employee', 'recruiter_pro')),
    CONSTRAINT status_check CHECK (status IN ('active', 'cancelled', 'expired', 'pending'))
);

CREATE INDEX idx_subscriptions_plan_type ON user_subscriptions(plan_type);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);

-- ============================================================================
-- CONTENT
-- ============================================================================

CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    category VARCHAR(100),
    duration_seconds INT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_creator_id ON videos(creator_id);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_views ON videos(views DESC);

CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_creator_id ON articles(creator_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_views ON articles(views DESC);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT content_type_check CHECK (content_type IN ('video', 'article'))
);

CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_content_id_type ON comments(content_id, content_type);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id BIGINT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT content_type_check CHECK (content_type IN ('video', 'article', 'comment')),
    CONSTRAINT unique_like UNIQUE(user_id, content_id, content_type)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_content_id_type ON likes(content_id, content_type);

-- ============================================================================
-- ADMIN
-- ============================================================================

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id BIGINT,
    status VARCHAR(50) NOT NULL,
    changes_json JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT status_check CHECK (status IN ('success', 'failure', 'error'))
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION ensure_candidate_role_fn() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_roles (user_id, role)
    SELECT NEW.user_id, 'candidate'
    WHERE NOT EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = NEW.user_id AND role = 'candidate'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_candidate_role
    AFTER INSERT ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION ensure_candidate_role_fn();
