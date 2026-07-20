import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Edit2, Loader2, ChevronDown } from 'lucide-react'
import {
  useEducations,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '../../hooks/useProfile'
import { useToastContext } from '../ToastProvider'
import type { EducationFormData } from '../../types/profile'

const educationSchema = z.object({
  schoolName: z.string().min(1, 'School name is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(100),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  grade: z.string().optional(),
  activities: z.string().optional(),
})

type EducationFormType = z.infer<typeof educationSchema>

interface EducationComponentProps {
  userId: number
}

export const EducationComponent: React.FC<EducationComponentProps> = ({ userId }) => {
  const { addToast } = useToastContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const { data: educations = [], isLoading } = useEducations(userId)
  const addMutation = useAddEducation(userId)
  const updateMutation = useUpdateEducation(userId, editingId || 0)
  const deleteMutation = useDeleteEducation(userId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormType>({
    resolver: zodResolver(educationSchema),
  })

  const onSubmit = async (data: EducationFormType) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync(data as EducationFormData)
        addToast('Education updated', 'success')
        setEditingId(null)
      } else {
        await addMutation.mutateAsync(data as EducationFormData)
        addToast('Education added', 'success')
      }
      reset()
      setIsFormOpen(false)
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to save education', 'error')
    }
  }

  const handleEdit = (id: number) => {
    const edu = educations.find((e) => e.id === id)
    if (edu) {
      reset({
        schoolName: edu.schoolName,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        grade: edu.grade,
        activities: edu.activities,
      })
      setEditingId(id)
      setIsFormOpen(true)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteMutation.mutateAsync(id)
        addToast('Education deleted', 'success')
      } catch (error: any) {
        addToast(error.response?.data?.message || 'Failed to delete education', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education</h2>
          <p className="text-sm text-gray-600 mt-1">Share your educational background</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            reset()
            setIsFormOpen(!isFormOpen)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School/University *
                </label>
                <input
                  {...register('schoolName')}
                  placeholder="School name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.schoolName && (
                  <p className="text-red-500 text-sm mt-1">{errors.schoolName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree *
                </label>
                <input
                  {...register('degree')}
                  placeholder="Degree"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.degree && (
                  <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <input
                {...register('fieldOfStudy')}
                placeholder="e.g., Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  {...register('grade')}
                  placeholder="e.g., 3.8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activities & Societies
              </label>
              <textarea
                {...register('activities')}
                placeholder="Clubs, societies, etc."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || addMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  'Update'
                ) : (
                  'Add'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false)
                  setEditingId(null)
                  reset()
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : educations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No education entries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.schoolName}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-xs text-gray-500">{edu.fieldOfStudy}</p>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedId === edu.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === edu.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                  {edu.grade && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium">GRADE</p>
                      <p className="text-sm text-gray-900">{edu.grade}</p>
                    </div>
                  )}

                  {edu.activities && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium">ACTIVITIES</p>
                      <p className="text-sm text-gray-600">{edu.activities}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(edu.id!)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id!)}
                      disabled={deleteMutation.isPending}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
