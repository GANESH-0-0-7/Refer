import api from '@/api/axios'
import {
  CompanyDetail,
  CompanySummary,
  JobDetail,
  JobSearchParams,
  JobSummary,
  MarketplaceDashboard,
  PageResponse,
  ReferralRequest,
  ReferralRequestPayload,
  ReferralStatus,
} from '../types/marketplace'

const MARKETPLACE_BASE_URL = '/v1/marketplace'

const cleanParams = (params: JobSearchParams): Record<string, string | number> => {
  return Object.entries(params).reduce<Record<string, string | number>>(
    (accumulator, [key, value]) => {
      if (value !== undefined && value !== '') {
        accumulator[key] = value
      }

      return accumulator
    },
    {}
  )
}

export const marketplaceService = {
  async getDashboard(): Promise<MarketplaceDashboard> {
    const response = await api.get<MarketplaceDashboard>(`${MARKETPLACE_BASE_URL}/dashboard`)
    return response.data
  },

  async searchJobs(params: JobSearchParams): Promise<PageResponse<JobSummary>> {
    const response = await api.get<PageResponse<JobSummary>>(`${MARKETPLACE_BASE_URL}/jobs`, {
      params: cleanParams(params),
    })
    return response.data
  },

  async getJob(slug: string): Promise<JobDetail> {
    const response = await api.get<JobDetail>(`${MARKETPLACE_BASE_URL}/jobs/slug/${slug}`)
    return response.data
  },

  async searchCompanies(search: string, page = 0, size = 10): Promise<PageResponse<CompanySummary>> {
    const response = await api.get<PageResponse<CompanySummary>>(`${MARKETPLACE_BASE_URL}/companies`, {
      params: cleanParams({ search, page, size }),
    })
    return response.data
  },

  async getCompany(slug: string): Promise<CompanyDetail> {
    const response = await api.get<CompanyDetail>(`${MARKETPLACE_BASE_URL}/companies/${slug}`)
    return response.data
  },

  async saveJob(jobId: number): Promise<void> {
    await api.post(`${MARKETPLACE_BASE_URL}/jobs/${jobId}/save`)
  },

  async unsaveJob(jobId: number): Promise<void> {
    await api.delete(`${MARKETPLACE_BASE_URL}/jobs/${jobId}/save`)
  },

  async getSavedJobs(page = 0, size = 10): Promise<PageResponse<JobSummary>> {
    const response = await api.get<PageResponse<JobSummary>>(`${MARKETPLACE_BASE_URL}/saved-jobs`, {
      params: { page, size },
    })
    return response.data
  },

  async requestReferral(jobId: number, payload: ReferralRequestPayload): Promise<ReferralRequest> {
    const response = await api.post<ReferralRequest>(
      `${MARKETPLACE_BASE_URL}/jobs/${jobId}/referral-requests`,
      payload
    )
    return response.data
  },

  async getReferralRequests(page = 0, size = 10): Promise<PageResponse<ReferralRequest>> {
    const response = await api.get<PageResponse<ReferralRequest>>(`${MARKETPLACE_BASE_URL}/referral-requests`, {
      params: { page, size },
    })
    return response.data
  },

  async updateReferralStatus(referralRequestId: number, status: ReferralStatus, rejectionReason?: string): Promise<ReferralRequest> {
    const response = await api.patch<ReferralRequest>(
      `${MARKETPLACE_BASE_URL}/referral-requests/${referralRequestId}/status`,
      { status, rejectionReason }
    )
    return response.data
  },
}
