'use client'

import { useState } from 'react'
import SearchForm from './components/SearchForm'
import ResultCard from './components/ResultCard'
import LoadingState from './components/LoadingState'
import ErrorMessage from './components/ErrorMessage'
import type { AnalysisResult } from './lib/types'

/**
 * Home page.
 *
 * Manages three states:
 *   - idle: show just the search form
 *   - loading: show spinner while API call is in progress
 *   - done: show result card (or error message)
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Called when user submits the search form
  async function handleAnalyze(company: string) {
    // Reset previous results
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResult(data.result)
      }
    } catch {
      setError('Network error. Make sure the server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          AI Investment Research Agent
        </h1>
        <p className="mt-2 text-gray-500 text-sm max-w-md">
          Enter a company name to get an AI-powered investment overview — including
          strengths, risks, competitors, and a final recommendation.
        </p>
      </div>

      {/* Search input */}
      <SearchForm onSubmit={handleAnalyze} isLoading={isLoading} />

      {/* Output area */}
      <div className="mt-10 w-full flex flex-col items-center gap-6">
        {isLoading && <LoadingState />}
        {error && <ErrorMessage message={error} />}
        {result && <ResultCard result={result} />}
      </div>
    </main>
  )
}
