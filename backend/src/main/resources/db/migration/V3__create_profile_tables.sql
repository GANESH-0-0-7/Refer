-- V3__create_profile_tables.sql

-- Create UserProfile table
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    title VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(500),
    avatar_url VARCHAR(500),
    profile_visibility VARCHAR(20) DEFAULT 'PUBLIC' NOT NULL,
    profile_completion INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_profile_visibility ON user_profiles(profile_visibility);

-- Create WorkExperience table
CREATE TABLE work_experiences (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current_job BOOLEAN DEFAULT false NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_exp_user_profile_id ON work_experiences(user_profile_id);
CREATE INDEX idx_work_exp_is_current ON work_experiences(is_current_job);

-- Create Education table
CREATE TABLE educations (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    school_name VARCHAR(200) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE,
    grade VARCHAR(10),
    activities TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_education_user_profile_id ON educations(user_profile_id);

-- Create Skills table
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    user_profile_id BIGINT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    endorsement_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_user_profile_id ON skills(user_profile_id);
CREATE INDEX idx_profile_skills_skill_name
ON skills(skill_name);
