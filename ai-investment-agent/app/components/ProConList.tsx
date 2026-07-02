interface ProConListProps {
  items: string[]
  type: 'pro' | 'con'
}

/**
 * Reusable component for displaying pros or cons.
 * Green checkmarks for pros, red X's for cons.
 */
export default function ProConList({ items, type }: ProConListProps) {
  const isPro = type === 'pro'

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          {/* Icon */}
          <span className={`mt-0.5 text-base flex-shrink-0 ${isPro ? 'text-green-500' : 'text-red-500'}`}>
            {isPro ? '✓' : '✗'}
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
