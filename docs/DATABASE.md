# ReferAI Database Design

## Overview

PostgreSQL 16 with 21 core tables supporting all MVP features.

## Schema Organization

```
Users & Authentication (3 tables)
├── users
├── user_roles
└── oauth_tokens

Candidate Profiles (5 tables)
├── candidates
├── candidate_education
├── candidate_skills
├── candidate_experience
└── candidate_projects

Employee Profiles (1 table)
└── employees

Recruiter Profiles (1 table)
└── recruiters

Core Features (3 tables)
├── resumes
├── interviews
└── referrals

Gamification (4 tables)
├── user_achievements
├── user_streaks
├── user_xp_history
└── user_ranks

Social (2 tables)
├── followers
└── user_subscriptions

Content (4 tables)
├── videos
├── articles
├── comments
└── likes

Admin (1 table)
└── audit_logs
```

## Key Tables

### users
Central user entity. All users in the system.
```sql
PK: id
Unique: email
Indexes: email, status, created_at
Foreign Keys: None
```

### candidates
Candidate-specific data with career metrics.
```sql
PK: id
FK: user_id → users(id)
Unique: user_id
Indexes: career_rating DESC, global_rank, xp_points DESC
Business Keys: user_id (one-to-one)
```

### candidate_skills
Many-to-many candidate skills with proficiency.
```sql
PK: id
FK: candidate_id → candidates(id)
Indexes: candidate_id, skill_name
Business Keys: (candidate_id, skill_name)
```

### resumes
Resume uploads and analysis results.
```sql
PK: id
FK: candidate_id → candidates(id)
Indexes: candidate_id, ats_score DESC
Columns: file_url (storage reference), skill_matrix_json (JSONB)
Business Rule: One candidate can have multiple resumes
```

### interviews
Mock interviews and performance records.
```sql
PK: id
FK: candidate_id → candidates(id)
FK: interviewer_id → users(id) [nullable for AI interviews]
Indexes: candidate_id, interviewer_id, interview_type, created_at DESC
Columns: scores_json (JSONB), feedback_json (JSONB)
```

### referrals
Referral pipeline from request to hiring.
```sql
PK: id
FK: candidate_id → candidates(id)
FK: employee_id → employees(id)
Indexes: candidate_id, employee_id, status, company_id, created_at DESC
Business Rule: Tracks entire referral lifecycle
Status Pipeline: requested → pending → accepted → rejected | applied → 
interviewing → offer → hired | closed
```

### user_ranks
Global ranking data with tiers.
```sql
PK: id
FK: user_id → users(id)
Unique: user_id
Indexes: global_rank, tier, points DESC
Tiers: bronze → silver → gold → platinum → diamond → master → grandmaster
Updated: Nightly batch job or trigger-based
```

## Indexing Strategy

### High-Priority Indexes
```sql
-- Authentication
CREATE INDEX idx_users_email ON users(email);

-- Search & Filtering
CREATE INDEX idx_candidates_career_rating ON candidates(career_rating DESC);
CREATE INDEX idx_candidates_global_rank ON candidates(global_rank);

-- Activity Tracking
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);
CREATE INDEX idx_referrals_created_at ON referrals(created_at DESC);

-- Foreign Key Performance
CREATE INDEX idx_education_candidate_id ON candidate_education(candidate_id);
CREATE INDEX idx_skills_candidate_id ON candidate_skills(candidate_id);
```

### Composite Indexes
```sql
-- Comments and likes querying
CREATE INDEX idx_comments_content_id_type ON comments(content_id, content_type);
CREATE INDEX idx_likes_content_id_type ON likes(content_id, content_type);

-- User roles querying
CREATE UNIQUE INDEX idx_user_roles_unique ON user_roles(user_id, role);
```

## Query Patterns

### Get Candidate's Full Profile
```sql
SELECT 
  c.*, 
  u.email, u.first_name, u.last_name,
  array_agg(cs.skill_name) as skills,
  array_agg(ce.company) as companies
FROM candidates c
JOIN users u ON c.user_id = u.id
LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
LEFT JOIN candidate_experience ce ON c.id = ce.candidate_id
WHERE c.user_id = $1
GROUP BY c.id, u.id;
```

### Global Rankings Query
```sql
SELECT ur.global_rank, u.first_name, u.last_name, ur.tier, ur.points
FROM user_ranks ur
JOIN users u ON ur.user_id = u.id
ORDER BY ur.global_rank ASC
LIMIT 100;
```

### Referral Pipeline Status
```sql
SELECT 
  r.status,
  COUNT(*) as count,
  AVG(r.created_at) as avg_duration
FROM referrals r
GROUP BY r.status
ORDER BY r.created_at DESC;
```

## Data Relationships

```
users (1) ──────────────────── (many) user_roles
 │
 ├──────(1)──────────── (1)────── candidates
 │                        │
 │                        ├────(many)──── candidate_education
 │                        ├────(many)──── candidate_skills
 │                        ├────(many)──── candidate_experience
 │                        ├────(many)──── candidate_projects
 │                        └────(many)──── resumes
 │
 ├──────(1)──────────── (1)────── employees
 │                        │
 │                        └────(many)──── employee_referrals
 │
 ├──────(1)──────────── (1)────── recruiters
 │
 ├──────(1)──────────── (many) ──── oauth_tokens
 │
 ├──────(1)──────────── (many) ──── interviews
 │
 ├──────(1)──────────── (many) ──── user_achievements
 │
 ├──────(1)──────────── (1)──────── user_streaks
 │
 ├──────(1)──────────── (many) ──── user_xp_history
 │
 ├──────(1)──────────── (1)──────── user_ranks
 │
 ├──────(1)──────────── (many) ──── videos
 │
 ├──────(1)──────────── (many) ──── articles
 │
 └──────(many)────────────────────── followers (self-referencing)
```

## Performance Considerations

### Query Optimization
- Use connection pooling (HikariCP configured for 20 connections)
- Batch inserts for bulk operations (batch_size: 20)
- Redis caching for frequently accessed data

### Data Archiving
- Old interviews (>1 year) archived to cold storage
- Audit logs retained for 7 years
- Old user data follows GDPR retention policies

### Vacuum & Maintenance
- Automated `VACUUM ANALYZE` weekly
- Monitor table bloat
- Reindex on maintenance window

## JSONB Columns

Used for flexible, semi-structured data:

### scores_json (interviews table)
```json
{
  "technical_score": 85,
  "communication_score": 78,
  "confidence_score": 82,
  "overall_rating": 82,
  "categories": {
    "problem_solving": 88,
    "code_quality": 83,
    "explanation": 75
  }
}
```

### skill_matrix_json (resumes table)
```json
{
  "java": { "required": true, "found": true, "confidence": 0.95 },
  "python": { "required": false, "found": true, "confidence": 0.87 },
  "aws": { "required": true, "found": false, "confidence": 0.0 }
}
```

### feedback_json (interviews table)
```json
{
  "strengths": ["Quick learner", "Good communication"],
  "areas_for_improvement": ["System design knowledge"],
  "recommendations": ["Study distributed systems"],
  "next_steps": ["Senior interviewer round"]
}
```

## Migrations

Using Flyway with semantic versioning:
```
V1__initial_schema.sql          (21 tables)
V2__add_audit_logging.sql       (if needed)
V3__add_indexes.sql             (if needed)
```

## Backup & Recovery

- Daily backups to `/d/ReferAI/postgres_data`
- WAL archiving enabled
- Point-in-time recovery capability
- Retention: 30 days (configurable)

---

See [ARCHITECTURE.md](ARCHITECTURE.md) for system design context.
