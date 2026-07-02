/**
 * Shown while the API is fetching research and running the LLM.
 * Simple spinner with a note that it takes a few seconds.
 */
export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-500">
      {/* Spinning circle */}
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <div className="text-center">
        <p className="font-medium text-gray-700">Researching company...</p>
        <p className="text-sm mt-1">Gathering data and running analysis. This takes 10–20 seconds.</p>
      </div>
    </div>
  )
}
