import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

interface ProfileCompletionProps {
  completion: number
  showLabel?: boolean
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completion = 0,
  showLabel = true,
}) => {
  const getColor = (percent: number) => {
    if (percent < 25) return 'text-red-500'
    if (percent < 50) return 'text-orange-500'
    if (percent < 75) return 'text-yellow-500'
    if (percent < 100) return 'text-blue-500'
    return 'text-green-500'
  }

  const getBgColor = (percent: number) => {
    if (percent < 25) return 'bg-red-100'
    if (percent < 50) return 'bg-orange-100'
    if (percent < 75) return 'bg-yellow-100'
    if (percent < 100) return 'bg-blue-100'
    return 'bg-green-100'
  }

  const getProgressColor = (percent: number) => {
    if (percent < 25) return 'bg-red-500'
    if (percent < 50) return 'bg-orange-500'
    if (percent < 75) return 'bg-yellow-500'
    if (percent < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Profile Completion</label>
          <span className={`text-sm font-bold ${getColor(completion)}`}>{completion}%</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className={`h-2 rounded-full ${getBgColor(completion)} overflow-hidden`}>
            <div
              className={`h-full ${getProgressColor(completion)} transition-all duration-300`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {completion === 100 ? (
          <CheckCircle2 className={`h-5 w-5 ${getColor(completion)} flex-shrink-0`} />
        ) : (
          <Circle className={`h-5 w-5 ${getColor(completion)} flex-shrink-0`} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
        <div>Basic Info</div>
        <div>Avatar</div>
        <div>Work Experience</div>
        <div>Education</div>
        <div>Skills</div>
      </div>
    </div>
  )
}
