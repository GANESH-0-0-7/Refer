-- Flyway Migration: V2__add_roles_and_refresh_tokens.sql
-- Add roles table and refresh_tokens table

-- Create roles table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    CONSTRAINT code_check CHECK (code IN ('ROLE_CANDIDATE', 'ROLE_EMPLOYEE', 'ROLE_RECRUITER', 'ROLE_ADMIN', 'ROLE_MENTOR'))
);

CREATE INDEX idx_roles_code ON roles(code);
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Insert default roles
INSERT INTO roles (code, name, description) VALUES
    ('ROLE_CANDIDATE', 'Candidate', 'Job candidate role'),
    ('ROLE_EMPLOYEE', 'Employee', 'Company employee role'),
    ('ROLE_RECRUITER', 'Recruiter', 'Recruiter role'),
    ('ROLE_ADMIN', 'Admin', 'Administrator role'),
    ('ROLE_MENTOR', 'Mentor', 'Mentor role');
