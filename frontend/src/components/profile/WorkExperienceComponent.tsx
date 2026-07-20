import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Edit2, Loader2, ChevronDown } from 'lucide-react'
import {
  useWorkExperiences,
  useAddWorkExperience,
  useUpdateWorkExperience,
  useDeleteWorkExperience,
} from '../../hooks/useProfile'
import { useToastContext } from '../ToastProvider'
import type { WorkExperienceFormData } from '../../types/profile'

const workExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  employmentType: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrentJob: z.boolean().default(false),
  description: z.string().optional(),
})

type WorkExperienceFormType = z.infer<typeof workExperienceSchema>

interface WorkExperienceComponentProps {
  userId: number
}

export const WorkExperienceComponent: React.FC<WorkExperienceComponentProps> = ({ userId }) => {
  const { addToast } = useToastContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const { data: experiences = [], isLoading } = useWorkExperiences(userId)
  const addMutation = useAddWorkExperience(userId)
  const updateMutation = useUpdateWorkExperience(userId, editingId || 0)
  const deleteMutation = useDeleteWorkExperience(userId)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkExperienceFormType>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      isCurrentJob: false,
    },
  })

  const isCurrentJob = watch('isCurrentJob')

  const onSubmit = async (data: WorkExperienceFormType) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync(data as WorkExperienceFormData)
        addToast('Work experience updated', 'success')
        setEditingId(null)
      } else {
        await addMutation.mutateAsync(data as WorkExperienceFormData)
        addToast('Work experience added', 'success')
      }
      reset()
      setIsFormOpen(false)
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to save work experience', 'error')
    }
  }

  const handleEdit = (id: number) => {
    const exp = experiences.find((e) => e.id === id)
    if (exp) {
      reset({
        companyName: exp.companyName,
        jobTitle: exp.jobTitle,
        employmentType: exp.employmentType,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrentJob: exp.isCurrentJob || false,
        description: exp.description,
      })
      setEditingId(id)
      setIsFormOpen(true)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this work experience?')) {
      try {
        await deleteMutation.mutateAsync(id)
        addToast('Work experience deleted', 'success')
      } catch (error: any) {
        addToast(error.response?.data?.message || 'Failed to delete work experience', 'error')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-600 mt-1">Showcase your professional background</p>
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
          Add Experience
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">
            {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  {...register('companyName')}
                  placeholder="Company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  {...register('jobTitle')}
                  placeholder="Job Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                {...register('employmentType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  disabled={isCurrentJob}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                {...register('isCurrentJob')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">I currently work here</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                placeholder="Describe your responsibilities..."
                rows={3}
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
      ) : experiences.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No work experiences yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === exp.id ? null : (exp.id || null))}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm text-gray-600">{exp.companyName}</p>
                  <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedId === exp.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === exp.id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                  {exp.description && (
                    <div>
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(exp.id!)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id!)}
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
