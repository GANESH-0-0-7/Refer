import { FormEvent, useState } from 'react'

import { JobSummary, ReferralRequestPayload } from '../types/marketplace'

interface ReferralRequestModalProps {
  job: JobSummary | null
  loading: boolean
  onClose: () => void
  onSubmit: (payload: ReferralRequestPayload) => void
}

export function ReferralRequestModal({ job, loading, onClose, onSubmit }: ReferralRequestModalProps) {
  const [message, setMessage] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  if (!job) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      message,
      resumeUrl: resumeUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg border border-slate-700 bg-slate-900 p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">Request referral</h2>
          <p className="mt-1 text-sm text-slate-400">
            {job.title} at {job.company.name}
          </p>
        </div>

        <label className="block text-sm font-medium text-slate-200" htmlFor="referral-message">
          Message
        </label>
        <textarea
          id="referral-message"
          required
          minLength={20}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="Share why you are a strong fit and what context would help the referrer."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={resumeUrl}
            onChange={(event) => setResumeUrl(event.target.value)}
            placeholder="Resume URL"
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />
          <input
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="LinkedIn URL"
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />
          <input
            value={portfolioUrl}
            onChange={(event) => setPortfolioUrl(event.target.value)}
            placeholder="Portfolio URL"
            className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Submit request
          </button>
        </div>
      </form>
    </div>
  )
}
