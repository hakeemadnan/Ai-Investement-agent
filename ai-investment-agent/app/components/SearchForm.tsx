'use client'

import { useState } from 'react'

interface SearchFormProps {
  onSubmit: (company: string) => void
  isLoading: boolean
}

/**
 * Simple form with a text input and submit button.
 * Disabled during loading to prevent duplicate requests.
 */
export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. Apple, Tesla, Infosys..."
        disabled={isLoading}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm
                   hover:bg-blue-700 transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}
