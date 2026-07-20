CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    industry VARCHAR(120) NOT NULL,
    headquarters VARCHAR(180),
    company_size VARCHAR(80),
    description TEXT,
    open_roles_count INT NOT NULL DEFAULT 0,
    referral_success_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_slug ON companies(slug);

CREATE TABLE job_postings (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(220) NOT NULL,
    slug VARCHAR(260) NOT NULL UNIQUE,
    location VARCHAR(180) NOT NULL,
    workplace_type VARCHAR(40) NOT NULL,
    employment_type VARCHAR(40) NOT NULL,
    experience_level VARCHAR(40) NOT NULL,
    min_salary INT,
    max_salary INT,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    apply_url TEXT,
    referral_bonus INT,
    status VARCHAR(40) NOT NULL DEFAULT 'OPEN',
    posted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT job_workplace_type_check CHECK (workplace_type IN ('REMOTE', 'HYBRID', 'ONSITE')),
    CONSTRAINT job_employment_type_check CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    CONSTRAINT job_experience_level_check CHECK (experience_level IN ('ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE')),
    CONSTRAINT job_status_check CHECK (status IN ('OPEN', 'CLOSED', 'PAUSED'))
);

CREATE INDEX idx_job_postings_company_id ON job_postings(company_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_location ON job_postings(location);
CREATE INDEX idx_job_postings_posted_at ON job_postings(posted_at DESC);
CREATE INDEX idx_job_postings_title ON job_postings(title);

CREATE TABLE saved_jobs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_saved_job UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);

CREATE TABLE referral_requests (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    referrer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'REQUESTED',
    message TEXT NOT NULL,
    resume_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    rejection_reason TEXT,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT referral_request_status_check CHECK (status IN ('REQUESTED', 'REVIEWING', 'REFERRED', 'DECLINED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'HIRED', 'CLOSED')),
    CONSTRAINT unique_referral_request UNIQUE(requester_id, job_id)
);

CREATE INDEX idx_referral_requests_requester_id ON referral_requests(requester_id);
CREATE INDEX idx_referral_requests_referrer_id ON referral_requests(referrer_id);
CREATE INDEX idx_referral_requests_job_id ON referral_requests(job_id);
CREATE INDEX idx_referral_requests_status ON referral_requests(status);
CREATE INDEX idx_referral_requests_requested_at ON referral_requests(requested_at DESC);

INSERT INTO companies (name, slug, logo_url, website_url, industry, headquarters, company_size, description, open_roles_count, referral_success_rate)
VALUES
('OpenAI', 'openai', 'https://logo.clearbit.com/openai.com', 'https://openai.com', 'Artificial Intelligence', 'San Francisco, CA', '1,001-5,000', 'AI research and deployment company building useful and safe AI systems.', 2, 68.50),
('Stripe', 'stripe', 'https://logo.clearbit.com/stripe.com', 'https://stripe.com', 'Fintech', 'San Francisco, CA', '5,001-10,000', 'Financial infrastructure platform for internet businesses.', 2, 61.00),
('Atlassian', 'atlassian', 'https://logo.clearbit.com/atlassian.com', 'https://atlassian.com', 'Collaboration Software', 'Sydney, Australia', '10,001+', 'Software company helping teams plan, track, and collaborate.', 1, 57.25),
('Datadog', 'datadog', 'https://logo.clearbit.com/datadoghq.com', 'https://datadoghq.com', 'Cloud Monitoring', 'New York, NY', '5,001-10,000', 'Observability and security platform for cloud applications.', 1, 54.75);

INSERT INTO job_postings (company_id, title, slug, location, workplace_type, employment_type, experience_level, min_salary, max_salary, currency, description, requirements, apply_url, referral_bonus)
SELECT id, 'Senior Frontend Engineer', 'openai-senior-frontend-engineer', 'San Francisco, CA', 'HYBRID', 'FULL_TIME', 'SENIOR', 185000, 260000, 'USD', 'Build high-quality product interfaces for AI-powered workflows used by millions of people.', 'React, TypeScript, design systems, performance engineering, accessibility, API integration.', website_url || '/careers', 5000 FROM companies WHERE slug = 'openai';

INSERT INTO job_postings (company_id, title, slug, location, workplace_type, employment_type, experience_level, min_salary, max_salary, currency, description, requirements, apply_url, referral_bonus)
SELECT id, 'Machine Learning Platform Engineer', 'openai-ml-platform-engineer', 'Remote', 'REMOTE', 'FULL_TIME', 'SENIOR', 190000, 285000, 'USD', 'Develop platform capabilities that make model development and deployment reliable at scale.', 'Distributed systems, Python, Kubernetes, ML infrastructure, observability.', website_url || '/careers', 7000 FROM companies WHERE slug = 'openai';

INSERT INTO job_postings (company_id, title, slug, location, workplace_type, employment_type, experience_level, min_salary, max_salary, currency, description, requirements, apply_url, referral_bonus)
SELECT id, 'Backend Engineer, Payments', 'stripe-backend-engineer-payments', 'New York, NY', 'HYBRID', 'FULL_TIME', 'MID', 155000, 230000, 'USD', 'Design and operate payment APIs that support global businesses.', 'Java, distributed systems, API design, PostgreSQL, reliability engineering.', website_url || '/jobs', 3500 FROM companies WHERE slug = 'stripe';

INSERT INTO job_postings (company_id, title, slug, location, workplace_type, employment_type, experience_level, min_salary, max_salary, currency, description, requirements, apply_url, referral_bonus)
SELECT id, 'Product Designer', 'stripe-product-designer', 'Remote', 'REMOTE', 'FULL_TIME', 'MID', 145000, 210000, 'USD', 'Create elegant product experiences for complex financial workflows.', 'Interaction design, prototyping, systems thinking, user research.', website_url || '/jobs', 2500 FROM companies WHERE slug = 'stripe';

INSERT INTO job_postings (company_id, title, slug, location, workplace_type, employment_type, experience_level, min_salary, max_salary, currency, description, requirements, apply_url, referral_bonus)
SELECT id, 'Engineering Manager, Collaboration', 'atlassian-engineering-manager-collaboration', 'Austin, TX', 'HYBRID', 'FULL_TIME', 'LEAD', 175000, 245000, 'USD', 'Lead engineering teams building collaboration experiences for distributed teams.', 'People leadership, Java, React, cloud architecture, delivery execution.', website_url || '/company/careers', 4000 FROM companies WHERE slug = 'atlassian';

INSERT INTO job_postings (company_id, title, slug, location, workplace_type, employment_type, experience_level, min_salary, max_salary, currency, description, requirements, apply_url, referral_bonus)
SELECT id, 'Site Reliability Engineer', 'datadog-site-reliability-engineer', 'Boston, MA', 'ONSITE', 'FULL_TIME', 'SENIOR', 160000, 225000, 'USD', 'Operate highly available systems behind observability products.', 'Linux, Kubernetes, incident response, Go, monitoring, automation.', website_url || '/careers', 3000 FROM companies WHERE slug = 'datadog';
