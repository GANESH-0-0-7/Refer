import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { marketplaceService } from '../services/marketplaceService'
import { JobSearchParams, ReferralRequestPayload } from '../types/marketplace'

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  dashboard: () => [...marketplaceKeys.all, 'dashboard'] as const,
  jobs: (params: JobSearchParams) => [...marketplaceKeys.all, 'jobs', params] as const,
  job: (slug: string) => [...marketplaceKeys.all, 'job', slug] as const,
  companies: (search: string, page: number) => [...marketplaceKeys.all, 'companies', search, page] as const,
  company: (slug: string) => [...marketplaceKeys.all, 'company', slug] as const,
  savedJobs: (page: number) => [...marketplaceKeys.all, 'saved-jobs', page] as const,
  referrals: (page: number) => [...marketplaceKeys.all, 'referrals', page] as const,
}

export const useMarketplaceDashboard = () => {
  return useQuery({
    queryKey: marketplaceKeys.dashboard(),
    queryFn: marketplaceService.getDashboard,
  })
}

export const useJobs = (params: JobSearchParams) => {
  return useQuery({
    queryKey: marketplaceKeys.jobs(params),
    queryFn: () => marketplaceService.searchJobs(params),
  })
}

export const useJob = (slug: string) => {
  return useQuery({
    queryKey: marketplaceKeys.job(slug),
    queryFn: () => marketplaceService.getJob(slug),
    enabled: Boolean(slug),
  })
}

export const useCompanies = (search: string, page: number) => {
  return useQuery({
    queryKey: marketplaceKeys.companies(search, page),
    queryFn: () => marketplaceService.searchCompanies(search, page),
  })
}

export const useCompany = (slug: string) => {
  return useQuery({
    queryKey: marketplaceKeys.company(slug),
    queryFn: () => marketplaceService.getCompany(slug),
    enabled: Boolean(slug),
  })
}

export const useSavedJobs = (page: number) => {
  return useQuery({
    queryKey: marketplaceKeys.savedJobs(page),
    queryFn: () => marketplaceService.getSavedJobs(page),
  })
}

export const useReferralRequests = (page: number) => {
  return useQuery({
    queryKey: marketplaceKeys.referrals(page),
    queryFn: () => marketplaceService.getReferralRequests(page),
  })
}

export const useSaveJobMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: marketplaceService.saveJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}

export const useUnsaveJobMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: marketplaceService.unsaveJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}

export const useReferralRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ jobId, payload }: { jobId: number; payload: ReferralRequestPayload }) =>
      marketplaceService.requestReferral(jobId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: marketplaceKeys.all })
    },
  })
}
