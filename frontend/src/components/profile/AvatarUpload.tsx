import React, { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { useUploadAvatar, useDeleteAvatar } from '../../hooks/useProfile'
import { useToastContext } from '../ToastProvider'

interface AvatarUploadProps {
  userId: number
  currentAvatarUrl?: string
  onSuccess?: () => void
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  userId,
  currentAvatarUrl,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const { addToast } = useToastContext()

  const uploadMutation = useUploadAvatar(userId)
  const deleteMutation = useDeleteAvatar(userId)

  const isLoading = uploadMutation.isPending || deleteMutation.isPending

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      addToast('Invalid file type', 'error', 'Only PNG and JPG images are allowed')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast('File too large', 'error', 'Maximum file size is 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadMutation.mutate(file, {
      onSuccess: () => {
        addToast('Avatar uploaded successfully', 'success')
        setPreview(null)
        onSuccess?.()
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Failed to upload avatar'
        addToast(message, 'error')
        setPreview(null)
      },
    })
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        addToast('Avatar deleted successfully', 'success')
        setPreview(null)
        onSuccess?.()
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Failed to delete avatar'
        addToast(message, 'error')
      },
    })
  }

  const displayImage = preview || currentAvatarUrl

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-100 shadow-lg">
          {displayImage ? (
            <img
              src={displayImage}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">
              <Upload className="w-8 h-8 mx-auto" />
              <p className="text-xs mt-1">No avatar</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`w-full max-w-md p-6 rounded-lg border-2 border-dashed transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0])
            }
          }}
          className="hidden"
          disabled={isLoading}
        />

        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Drag and drop your image</p>
            <p className="text-xs text-gray-500">or click to select</p>
            <p className="text-xs text-gray-400 mt-1">PNG or JPG, max 5MB</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {currentAvatarUrl && (
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Remove Avatar
          </div>
        </button>
      )}
    </div>
  )
}
