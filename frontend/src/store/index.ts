import { configureStore } from '@reduxjs/toolkit'

import marketplaceReducer from '@/features/marketplace/store/marketplaceSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    marketplace: marketplaceReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
