import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { profileService } from '@/services/profileService'

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return

      try {
        const data = await profileService.getProfile(user.id)
        setProfile(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-8 py-10">

        <h1 className="text-4xl font-bold mb-8">
          My Profile
        </h1>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-slate-400 text-sm">First Name</label>
              <p className="text-xl mt-1">
                {profile?.firstName}
              </p>
            </div>

            <div>
              <label className="text-slate-400 text-sm">Last Name</label>
              <p className="text-xl mt-1">
                {profile?.lastName}
              </p>
            </div>

            <div>
              <label className="text-slate-400 text-sm">Email</label>
              <p className="text-xl mt-1">
                {profile?.email}
              </p>
            </div>

            <div>
              <label className="text-slate-400 text-sm">Phone</label>
              <p className="text-xl mt-1">
                {profile?.phone || 'Not Added'}
              </p>
            </div>

            <div>
              <label className="text-slate-400 text-sm">Location</label>
              <p className="text-xl mt-1">
                {profile?.location || 'Not Added'}
              </p>
            </div>

            <div>
              <label className="text-slate-400 text-sm">Headline</label>
              <p className="text-xl mt-1">
                {profile?.headline || 'Not Added'}
              </p>
            </div>

          </div>

          <div className="mt-8">
            <label className="text-slate-400 text-sm">Bio</label>
            <p className="mt-2 text-slate-200">
              {profile?.bio || 'No bio available'}
            </p>
          </div>

          <button
            className="mt-8 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>

        </div>

      </div>
    </div>
  )
}