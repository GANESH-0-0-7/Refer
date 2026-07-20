export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type WorkplaceType = 'REMOTE' | 'HYBRID' | 'ONSITE'
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE'
export type JobStatus = 'OPEN' | 'CLOSED' | 'PAUSED'
export type ReferralStatus =
  | 'REQUESTED'
  | 'REVIEWING'
  | 'REFERRED'
  | 'DECLINED'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFER'
  | 'HIRED'
  | 'CLOSED'

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface CompanySummary {
  id: number
  name: string
  slug: string
  logoUrl?: string
  industry: string
  headquarters?: string
  companySize?: string
  openRolesCount: number
  referralSuccessRate: number
}

export interface CompanyDetail extends CompanySummary {
  websiteUrl?: string
  description?: string
  openJobs: JobSummary[]
}

export interface JobSummary {
  id: number
  title: string
  slug: string
  company: CompanySummary
  location: string
  workplaceType: WorkplaceType
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  minSalary?: number
  maxSalary?: number
  currency: string
  referralBonus?: number
  status: JobStatus
  postedAt: string
  saved: boolean
  referralRequested: boolean
}

export interface JobDetail extends JobSummary {
  description: string
  requirements: string
  applyUrl?: string
  expiresAt?: string
}

export interface ReferralRequest {
  id: number
  job: JobSummary
  requesterId: number
  requesterName?: string
  requesterEmail: string
  referrerId?: number
  referrerName?: string
  status: ReferralStatus
  message: string
  resumeUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  rejectionReason?: string
  requestedAt: string
  updatedAt: string
}

export interface ReferralRequestPayload {
  message: string
  resumeUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
}

export interface MarketplaceDashboard {
  openJobs: number
  savedJobs: number
  referralRequests: number
  referredRequests: number
  recentReferrals: ReferralRequest[]
  recommendedJobs: JobSummary[]
}

export interface JobSearchParams {
  search?: string
  company?: string
  location?: string
  workplaceType?: WorkplaceType | ''
  experienceLevel?: ExperienceLevel | ''
  page?: number
  size?: number
}
