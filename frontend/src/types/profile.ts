/* ============================================================
 * ReferAI - Profile Module Types
 * File: src/types/profile.ts
 * ============================================================
 */

/* ===========================
   Common Types
=========================== */

export type ProfileVisibility = "PUBLIC" | "PRIVATE";

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/* ===========================
   User Profile
=========================== */

export interface UserProfile {
  id: number;

  userId: number;

  title: string | null;

  bio: string | null;

  location: string | null;

  phone: string | null;

  website: string | null;

  avatarUrl: string | null;

  profileVisibility: ProfileVisibility;

  profileCompletion: number;

  workExperienceCount: number;

  educationCount: number;

  skillCount: number;

  workExperiences: WorkExperience[];

  educations: Education[];

  skills: Skill[];

  createdAt: string;

  updatedAt: string;
}

/* ===========================
   User Profile Request
=========================== */

export interface UserProfileRequest {
  title: string;

  bio: string;

  location: string;

  phone: string;

  website: string;

  profileVisibility: ProfileVisibility;
}

/* ===========================
   Work Experience
=========================== */

export interface WorkExperience {
  id: number;

  companyName: string;

  jobTitle: string;

  employmentType: string | null;

  startDate: string;

  endDate: string | null;

  isCurrentJob: boolean;

  description: string | null;

  duration: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface WorkExperienceRequest {
  companyName: string;

  jobTitle: string;

  employmentType?: string;

  startDate: string;

  endDate?: string | null;

  isCurrentJob: boolean;

  description?: string;
}

/* ===========================
   Education
=========================== */

export interface Education {
  id: number;

  schoolName: string;

  degree: string;

  fieldOfStudy: string | null;

  startDate: string | null;

  endDate: string | null;

  grade: string | null;

  activities: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface EducationRequest {
  schoolName: string;

  degree: string;

  fieldOfStudy?: string;

  startDate?: string;

  endDate?: string;

  grade?: string;

  activities?: string;
}

/* ===========================
   Skill
=========================== */

export interface Skill {
  id: number;

  skillName: string;

  endorsementCount: number;

  createdAt: string;

  updatedAt: string;
}

export interface SkillRequest {
  skillName: string;
}

/* ===========================
   Avatar
=========================== */

export interface AvatarUploadResponse {
  avatarUrl: string;
}

/* ===========================
   Resume (Future Phase)
=========================== */

export interface Resume {
  id: number;

  fileName: string;

  originalFileName: string;

  fileSize: number;

  mimeType: string;

  uploadedAt: string;
}

/* ===========================
   Form Models
=========================== */

export interface UserProfileFormData {
  title: string;

  bio: string;

  location: string;

  phone: string;

  website: string;

  profileVisibility: ProfileVisibility;
}

export interface WorkExperienceFormData {
  companyName: string;

  jobTitle: string;

  employmentType: string;

  startDate: string;

  endDate: string;

  isCurrentJob: boolean;

  description: string;
}

export interface EducationFormData {
  schoolName: string;

  degree: string;

  fieldOfStudy: string;

  startDate: string;

  endDate: string;

  grade: string;

  activities: string;
}

export interface SkillFormData {
  skillName: string;
}