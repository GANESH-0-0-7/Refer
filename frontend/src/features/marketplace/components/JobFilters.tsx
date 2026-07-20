import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import {
  resetMarketplaceFilters,
  setMarketplaceFilters,
} from '../store/marketplaceSlice'

export function JobFilters() {
  const dispatch = useDispatch()
  const filters = useSelector((state: RootState) => state.marketplace)

  return (
    <div className="grid gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4 md:grid-cols-5">
      <input
        value={filters.search}
        onChange={(event) => dispatch(setMarketplaceFilters({ search: event.target.value }))}
        placeholder="Search jobs"
        className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
      />

      <input
        value={filters.location}
        onChange={(event) => dispatch(setMarketplaceFilters({ location: event.target.value }))}
        placeholder="Location"
        className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
      />

      <select
        value={filters.workplaceType}
        onChange={(event) => dispatch(setMarketplaceFilters({ workplaceType: event.target.value as typeof filters.workplaceType }))}
        className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
      >
        <option value="">Any workplace</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
        <option value="ONSITE">Onsite</option>
      </select>

      <select
        value={filters.experienceLevel}
        onChange={(event) => dispatch(setMarketplaceFilters({ experienceLevel: event.target.value as typeof filters.experienceLevel }))}
        className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
      >
        <option value="">Any level</option>
        <option value="ENTRY">Entry</option>
        <option value="MID">Mid</option>
        <option value="SENIOR">Senior</option>
        <option value="LEAD">Lead</option>
        <option value="EXECUTIVE">Executive</option>
      </select>

      <button
        type="button"
        onClick={() => dispatch(resetMarketplaceFilters())}
        className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
      >
        Reset
      </button>
    </div>
  )
}
