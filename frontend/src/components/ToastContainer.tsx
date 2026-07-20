import React from 'react'

import { ToastType, useToastContext } from '../hooks/useToast'

const toastStyles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  error: 'border-red-200 bg-red-50 text-red-950',
  info: 'border-sky-200 bg-sky-50 text-sky-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
}

const indicatorStyles: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastContext()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      aria-live="polite"
      aria-relevant="additions removals"
      className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-start gap-3 rounded-md border p-4 shadow-lg ${toastStyles[toast.type]}`}
        >
          <span
            aria-hidden="true"
            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${indicatorStyles[toast.type]}`}
          />

          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-semibold leading-5">
              {toast.title}
            </p>

            {toast.description ? (
              <p className="mt-1 break-words text-sm leading-5 opacity-80">
                {toast.description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Dismiss notification"
            className="ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-current opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
            onClick={() => removeToast(toast.id)}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              x
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}
