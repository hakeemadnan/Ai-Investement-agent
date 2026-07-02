interface DecisionBadgeProps {
  decision: 'INVEST' | 'PASS'
  confidence: number
}

/**
 * Large badge showing the INVEST/PASS verdict + confidence percentage.
 * Green for INVEST, red for PASS.
 */
export default function DecisionBadge({ decision, confidence }: DecisionBadgeProps) {
  const isInvest = decision === 'INVEST'

  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl border-2 ${
      isInvest
        ? 'bg-green-50 border-green-300 text-green-800'
        : 'bg-red-50 border-red-300 text-red-800'
    }`}>
      {/* Big verdict text */}
      <span className="text-3xl font-bold tracking-tight">{decision}</span>

      {/* Divider */}
      <div className={`h-10 w-px ${isInvest ? 'bg-green-300' : 'bg-red-300'}`} />

      {/* Confidence */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider opacity-70">Confidence</p>
        <p className="text-2xl font-bold">{confidence}%</p>
      </div>
    </div>
  )
}
