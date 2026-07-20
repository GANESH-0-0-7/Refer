import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import {
  Toast,
  ToastContext,
  ToastContextValue,
  ToastType,
  useToastContext,
} from '../hooks/useToast'

interface ToastProviderProps {
  children: React.ReactNode
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: { id: string } }

const DEFAULT_TOAST_DURATION = 3000

const toastReducer = (state: Toast[], action: ToastAction): Toast[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload]
    case 'REMOVE_TOAST':
      return state.filter((toast) => toast.id !== action.payload.id)
    default:
      return state
  }
}

const createToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, [])
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  )

  const removeToast = useCallback((id: string): void => {
    const timeoutId = timeoutRefs.current.get(id)

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutRefs.current.delete(id)
    }

    dispatch({ type: 'REMOVE_TOAST', payload: { id } })
  }, [])

  const addToast = useCallback(
    (
      title: string,
      type: ToastType = 'info',
      description?: string,
      duration = DEFAULT_TOAST_DURATION
    ): string => {
      const id = createToastId()
      const toast: Toast = {
        id,
        title,
        description,
        type,
        duration,
      }

      dispatch({ type: 'ADD_TOAST', payload: toast })

      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          removeToast(id)
        }, duration)

        timeoutRefs.current.set(id, timeoutId)
      }

      return id
    },
    [removeToast]
  )

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutRefs.current.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export { useToastContext }
