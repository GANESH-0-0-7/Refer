import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

import { useProfile } from '../../hooks/useProfile'
import { ProfileCompletion } from './ProfileCompletion'
import { AvatarUpload } from './AvatarUpload'
import { ProfileBasicInfo } from './ProfileBasicInfo'
import { WorkExperienceComponent } from './WorkExperienceComponent'
import { EducationComponent } from './EducationComponent'
import { SkillsComponent } from './SkillsComponent'

import { Loader2 } from 'lucide-react'

interface ProfilePageProps {
  userId?: number
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId: propUserId }) => {
  const authUser = useSelector((state: RootState) => state.auth.user)

  const userId = propUserId ?? authUser?.id ?? null

  const { data: profile, isLoading } = useProfile(userId || 0)

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Build your professional profile and stand out
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : (
              <>
                {/* Completion */}
                <div className="bg-white rounded-lg shadow p-6">
                  <ProfileCompletion
                    completion={profile?.profileCompletion || 0}
                    showLabel
                  />
                </div>

                {/* Stats */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">

                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {(profile?.workExperienceCount || 0) +
                        (profile?.educationCount || 0) +
                        (profile?.skillCount || 0)}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Total Entries
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t pt-4">

                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {profile?.workExperienceCount || 0}
                      </p>

                      <p className="text-xs text-gray-600">
                        Experience
                      </p>
                    </div>

                    <div className="text-center border-x">
                      <p className="text-xl font-bold">
                        {profile?.educationCount || 0}
                      </p>

                      <p className="text-xs text-gray-600">
                        Education
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {profile?.skillCount || 0}
                      </p>

                      <p className="text-xs text-gray-600">
                        Skills
                      </p>
                    </div>

                  </div>
                </div>

                {/* Visibility */}
                {profile && (
                  <div className="bg-white rounded-lg shadow p-6">

                    <p className="text-sm font-medium text-gray-700">
                      Profile Status
                    </p>

                    <div className="mt-3 flex items-center gap-2">

                      <div
                        className={`w-3 h-3 rounded-full ${
                          profile.profileVisibility === 'PUBLIC'
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                        }`}
                      />

                      <span className="text-sm font-medium">
                        {profile.profileVisibility === 'PUBLIC'
                          ? 'Public'
                          : 'Private'}
                      </span>

                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                      {profile.profileVisibility === 'PUBLIC'
                        ? 'Your profile is visible to everyone.'
                        : 'Your profile is private.'}
                    </p>

                  </div>
                )}
              </>
            )}

          </div>

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-8">

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-6">
                Profile Photo
              </h2>

              <AvatarUpload
                userId={userId}
                currentAvatarUrl={profile?.avatarUrl}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <ProfileBasicInfo userId={userId} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <WorkExperienceComponent userId={userId} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <EducationComponent userId={userId} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <SkillsComponent userId={userId} />
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}