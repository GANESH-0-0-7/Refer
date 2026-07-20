import axiosInstance from './authService'
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

const PROFILE_BASE_URL = '/profiles'

export const profileService = {
  // Profile endpoints
  getProfile: async (userId: number): Promise<UserProfileDto> => {
    const response = await axiosInstance.get(`${PROFILE_BASE_URL}/${userId}`)
    return response.data
  },

  getPublicProfile: async (userId: number): Promise<UserProfileDto> => {
    const response = await axiosInstance.get(`${PROFILE_BASE_URL}/public/${userId}`)
    return response.data
  },

  createProfile: async (userId: number, data: UserProfileFormData): Promise<UserProfileDto> => {
    const response = await axiosInstance.post(`${PROFILE_BASE_URL}?userId=${userId}`, data)
    return response.data
  },

  updateProfile: async (userId: number, data: UserProfileFormData): Promise<UserProfileDto> => {
    const response = await axiosInstance.put(`${PROFILE_BASE_URL}/${userId}`, data)
    return response.data
  },

  deleteProfile: async (userId: number): Promise<void> => {
    await axiosInstance.delete(`${PROFILE_BASE_URL}/${userId}`)
  },

  uploadAvatar: async (userId: number, file: File): Promise<UserProfileDto> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post(
      `${PROFILE_BASE_URL}/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  deleteAvatar: async (userId: number): Promise<void> => {
    await axiosInstance.delete(`${PROFILE_BASE_URL}/${userId}/avatar`)
  },

  // Work Experience endpoints
  getWorkExperiences: async (userId: number): Promise<WorkExperienceDto[]> => {
    const response = await axiosInstance.get(
      `${PROFILE_BASE_URL}/${userId}/work-experiences`
    )
    return response.data
  },

  addWorkExperience: async (
    userId: number,
    data: WorkExperienceFormData
  ): Promise<WorkExperienceDto> => {
    const response = await axiosInstance.post(
      `${PROFILE_BASE_URL}/${userId}/work-experiences`,
      data
    )
    return response.data
  },

  updateWorkExperience: async (
    userId: number,
    experienceId: number,
    data: WorkExperienceFormData
  ): Promise<WorkExperienceDto> => {
    const response = await axiosInstance.put(
      `${PROFILE_BASE_URL}/${userId}/work-experiences/${experienceId}`,
      data
    )
    return response.data
  },

  deleteWorkExperience: async (userId: number, experienceId: number): Promise<void> => {
    await axiosInstance.delete(`${PROFILE_BASE_URL}/${userId}/work-experiences/${experienceId}`)
  },

  // Education endpoints
  getEducations: async (userId: number): Promise<EducationDto[]> => {
    const response = await axiosInstance.get(`${PROFILE_BASE_URL}/${userId}/educations`)
    return response.data
  },

  addEducation: async (userId: number, data: EducationFormData): Promise<EducationDto> => {
    const response = await axiosInstance.post(`${PROFILE_BASE_URL}/${userId}/educations`, data)
    return response.data
  },

  updateEducation: async (
    userId: number,
    educationId: number,
    data: EducationFormData
  ): Promise<EducationDto> => {
    const response = await axiosInstance.put(
      `${PROFILE_BASE_URL}/${userId}/educations/${educationId}`,
      data
    )
    return response.data
  },

  deleteEducation: async (userId: number, educationId: number): Promise<void> => {
    await axiosInstance.delete(`${PROFILE_BASE_URL}/${userId}/educations/${educationId}`)
  },

  // Skill endpoints
  getSkills: async (userId: number): Promise<SkillDto[]> => {
    const response = await axiosInstance.get(`${PROFILE_BASE_URL}/${userId}/skills`)
    return response.data
  },

  addSkill: async (userId: number, data: SkillFormData): Promise<SkillDto> => {
    const response = await axiosInstance.post(`${PROFILE_BASE_URL}/${userId}/skills`, data)
    return response.data
  },

  updateSkill: async (
    userId: number,
    skillId: number,
    data: SkillFormData
  ): Promise<SkillDto> => {
    const response = await axiosInstance.put(
      `${PROFILE_BASE_URL}/${userId}/skills/${skillId}`,
      data
    )
    return response.data
  },

  endorseSkill: async (userId: number, skillId: number): Promise<SkillDto> => {
    const response = await axiosInstance.post(
      `${PROFILE_BASE_URL}/${userId}/skills/${skillId}/endorse`
    )
    return response.data
  },

  removeEndorsement: async (userId: number, skillId: number): Promise<SkillDto> => {
    const response = await axiosInstance.delete(
      `${PROFILE_BASE_URL}/${userId}/skills/${skillId}/endorse`
    )
    return response.data
  },

  deleteSkill: async (userId: number, skillId: number): Promise<void> => {
    await axiosInstance.delete(`${PROFILE_BASE_URL}/${userId}/skills/${skillId}`)
  },
}

export default profileService
