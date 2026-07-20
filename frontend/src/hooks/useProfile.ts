import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profileService'
import type {
  UserProfileDto,
  WorkExperienceDto,
  EducationDto,
  SkillDto,
  UserProfileFormData,
  WorkExperienceFormData,
  EducationFormData,
  SkillFormData,
} from '../types/profile'

// Query Keys
const profileKeys = {
  all: ['profile'] as const,
  profile: (userId: number) => [...profileKeys.all, 'profile', userId] as const,
  publicProfile: (userId: number) => [...profileKeys.all, 'public', userId] as const,
  workExperiences: (userId: number) => [...profileKeys.all, 'work-experiences', userId] as const,
  educations: (userId: number) => [...profileKeys.all, 'educations', userId] as const,
  skills: (userId: number) => [...profileKeys.all, 'skills', userId] as const,
}

// Profile Hooks
export const useProfile = (userId: number) => {
  return useQuery({
    queryKey: profileKeys.profile(userId),
    queryFn: () => profileService.getProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const usePublicProfile = (userId: number) => {
  return useQuery({
    queryKey: profileKeys.publicProfile(userId),
    queryFn: () => profileService.getPublicProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UserProfileFormData }) =>
      profileService.createProfile(userId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(variables.userId),
      })
    },
  })
}

export const useUpdateProfile = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserProfileFormData) => profileService.updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

export const useDeleteProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => profileService.deleteProfile(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      })
    },
  })
}

export const useUploadAvatar = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

export const useDeleteAvatar = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => profileService.deleteAvatar(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

// Work Experience Hooks
export const useWorkExperiences = (userId: number) => {
  return useQuery({
    queryKey: profileKeys.workExperiences(userId),
    queryFn: () => profileService.getWorkExperiences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddWorkExperience = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkExperienceFormData) => profileService.addWorkExperience(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.workExperiences(userId),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

export const useUpdateWorkExperience = (userId: number, experienceId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkExperienceFormData) =>
      profileService.updateWorkExperience(userId, experienceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.workExperiences(userId),
      })
    },
  })
}

export const useDeleteWorkExperience = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (experienceId: number) =>
      profileService.deleteWorkExperience(userId, experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.workExperiences(userId),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

// Education Hooks
export const useEducations = (userId: number) => {
  return useQuery({
    queryKey: profileKeys.educations(userId),
    queryFn: () => profileService.getEducations(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddEducation = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EducationFormData) => profileService.addEducation(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.educations(userId),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

export const useUpdateEducation = (userId: number, educationId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EducationFormData) =>
      profileService.updateEducation(userId, educationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.educations(userId),
      })
    },
  })
}

export const useDeleteEducation = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (educationId: number) => profileService.deleteEducation(userId, educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.educations(userId),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

// Skills Hooks
export const useSkills = (userId: number) => {
  return useQuery({
    queryKey: profileKeys.skills(userId),
    queryFn: () => profileService.getSkills(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddSkill = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SkillFormData) => profileService.addSkill(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.skills(userId),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}

export const useUpdateSkill = (userId: number, skillId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SkillFormData) => profileService.updateSkill(userId, skillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.skills(userId),
      })
    },
  })
}

export const useEndorseSkill = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (skillId: number) => profileService.endorseSkill(userId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.skills(userId),
      })
    },
  })
}

export const useRemoveEndorsement = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (skillId: number) => profileService.removeEndorsement(userId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.skills(userId),
      })
    },
  })
}

export const useDeleteSkill = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (skillId: number) => profileService.deleteSkill(userId, skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.skills(userId),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(userId),
      })
    },
  })
}
