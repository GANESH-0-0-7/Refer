import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react'
import {
  useSkills,
  useAddSkill,
  useDeleteSkill,
  useEndorseSkill,
  useRemoveEndorsement,
} from '../../hooks/useProfile'
import { useToastContext } from '../ToastProvider'
import type { SkillFormData } from '../../types/profile'

const skillSchema = z.object({
  skillName: z.string().min(1, 'Skill name is required').max(100),
})

type SkillFormType = z.infer<typeof skillSchema>

interface SkillsComponentProps {
  userId: number
}

export const SkillsComponent: React.FC<SkillsComponentProps> = ({ userId }) => {
  const { addToast } = useToastContext()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: skills = [], isLoading } = useSkills(userId)
  const addMutation = useAddSkill(userId)
  const deleteMutation = useDeleteSkill(userId)
  const endorseMutation = useEndorseSkill(userId)
  const removeEndorsementMutation = useRemoveEndorsement(userId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormType>({
    resolver: zodResolver(skillSchema),
  })

  const onSubmit = async (data: SkillFormType) => {
    try {
      await addMutation.mutateAsync(data as SkillFormData)
      addToast('Skill added', 'success')
      reset()
      setIsFormOpen(false)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add skill'
      if (message.includes('already exists')) {
        addToast('Skill already exists', 'error')
      } else {
        addToast(message, 'error')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteMutation.mutateAsync(id)
        addToast('Skill deleted', 'success')
      } catch (error: any) {
        addToast(error.response?.data?.message || 'Failed to delete skill', 'error')
      }
    }
  }

  const handleEndorse = async (id: number) => {
    try {
      await endorseMutation.mutateAsync(id)
      addToast('Skill endorsed!', 'success')
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to endorse skill', 'error')
    }
  }

  const handleRemoveEndorsement = async (id: number) => {
    try {
      await removeEndorsementMutation.mutateAsync(id)
      addToast('Endorsement removed', 'success')
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to remove endorsement', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-600 mt-1">
            Highlight your professional skills and get endorsements
          </p>
        </div>
        <button
          onClick={() => {
            reset()
            setIsFormOpen(!isFormOpen)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Add New Skill</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1">
              <input
                {...register('skillName')}
                placeholder="e.g., JavaScript, React, AWS..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.skillName && (
                <p className="text-red-500 text-sm mt-1">{errors.skillName.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || addMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false)
                reset()
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No skills added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{skill.skillName}</h3>
                <p className="text-sm text-gray-600">
                  {skill.endorsementCount || 0} endorsement{(skill.endorsementCount || 0) !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEndorse(skill.id!)}
                  disabled={endorseMutation.isPending}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                  title="Endorse"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRemoveEndorsement(skill.id!)}
                  disabled={removeEndorsementMutation.isPending}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  title="Remove endorsement"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(skill.id!)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
