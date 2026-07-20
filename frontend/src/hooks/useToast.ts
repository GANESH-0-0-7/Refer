import { createContext, useContext } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration: number
}

export interface ToastContextValue {
  toasts: Toast[]
  addToast: (
    title: string,
    type?: ToastType,
    description?: string,
    duration?: number
  ) => string
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }

  return context
}
