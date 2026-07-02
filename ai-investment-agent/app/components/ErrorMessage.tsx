interface ErrorMessageProps {
  message: string
}

/**
 * Simple red error box. Keeps error display consistent across the app.
 */
export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
      <span className="font-medium">Error: </span>
      {message}
    </div>
  )
}
