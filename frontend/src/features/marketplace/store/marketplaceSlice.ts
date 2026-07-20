import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ExperienceLevel, WorkplaceType } from '../types/marketplace'

export interface MarketplaceFiltersState {
  search: string
  company: string
  location: string
  workplaceType: WorkplaceType | ''
  experienceLevel: ExperienceLevel | ''
  page: number
  pageSize: number
}

const initialState: MarketplaceFiltersState = {
  search: '',
  company: '',
  location: '',
  workplaceType: '',
  experienceLevel: '',
  page: 0,
  pageSize: 10,
}

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setMarketplaceFilters: (
      state,
      action: PayloadAction<Partial<Omit<MarketplaceFiltersState, 'page'>>>
    ) => {
      Object.assign(state, action.payload)
      state.page = 0
    },
    setMarketplacePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    resetMarketplaceFilters: () => initialState,
  },
})

export const {
  setMarketplaceFilters,
  setMarketplacePage,
  resetMarketplaceFilters,
} = marketplaceSlice.actions

export default marketplaceSlice.reducer
