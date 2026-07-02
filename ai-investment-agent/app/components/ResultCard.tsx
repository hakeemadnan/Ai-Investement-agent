import type { AnalysisResult } from '@/app/lib/types'
import DecisionBadge from './DecisionBadge'
import ProConList from './ProConList'

interface ResultCardProps {
  result: AnalysisResult
}

/**
 * The main results card. Displays all LLM output in a clean, structured layout.
 * Broken into clear sections: verdict, reasoning, pros/cons, and summary.
 */
export default function ResultCard({ result }: ResultCardProps) {
  // Format the timestamp into something readable
  const date = new Date(result.analyzedAt).toLocaleString()

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">{result.companyName}</h2>
        <p className="text-xs text-gray-400 mt-0.5">Analyzed at {date}</p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* INVEST / PASS verdict */}
        <DecisionBadge decision={result.decision} confidence={result.confidence} />

        {/* Reasoning section */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Reasoning
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{result.reasoning}</p>
        </section>

        {/* Pros and Cons side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-3">
              Pros
            </h3>
            <ProConList items={result.pros} type="pro" />
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">
              Cons
            </h3>
            <ProConList items={result.cons} type="con" />
          </section>
        </div>

        {/* Final summary */}
        <section className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Final Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
        </section>
      </div>

      {/* Footer disclaimer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          ⚠️ This is AI-generated research for educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
