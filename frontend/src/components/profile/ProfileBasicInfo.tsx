import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useProfile, useUpdateProfile, useCreateProfile } from '../../hooks/useProfile'
import { useToastContext } from '../ToastProvider'
import type { UserProfileFormData } from '../../types/profile'

// Validation schema
const profileValidationSchema = z.object({
  title: z.string().max(100, 'Title must not exceed 100 characters').optional().or(z.literal('')),
  bio: z.string().max(5000, 'Bio must not exceed 5000 characters').optional().or(z.literal('')),
  location: z
    .string()
    .max(100, 'Location must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[0-9\-\s()]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  profileVisibility: z.enum(['PUBLIC', 'PRIVATE']),
})

type ProfileFormData = z.infer<typeof profileValidationSchema>

interface ProfileBasicInfoProps {
  userId: number
}

export const ProfileBasicInfo: React.FC<ProfileBasicInfoProps> = ({ userId }) => {
  const { addToast } = useToastContext()
  const { data: profile, isLoading: isLoadingProfile } = useProfile(userId)
  const updateMutation = useUpdateProfile(userId)
  const createMutation = useCreateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      profileVisibility: 'PUBLIC',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        title: profile.title || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        profileVisibility: profile.profileVisibility || 'PUBLIC',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (profile) {
        await updateMutation.mutateAsync(data)
      } else {
        await createMutation.mutateAsync({ userId, data })
      }
      addToast('Profile updated successfully', 'success')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile'
      addToast(message, 'error')
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    )
  }

  const isProcessing = isSubmitting || updateMutation.isPending || createMutation.isPending

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-600 mt-1">
          Update your professional headline and information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Professional Title
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            {...register('bio')}
            placeholder="Tell us about yourself..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            {...register('location')}
            type="text"
            placeholder="City, Country"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+1-555-0123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              {...register('website')}
              type="url"
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('profileVisibility')}
                value="PUBLIC"
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Public</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register('profileVisibility')}
                value="PRIVATE"
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Private</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
