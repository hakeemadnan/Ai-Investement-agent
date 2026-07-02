// The structured result returned by the LLM after analysis
export interface AnalysisResult {
  decision: 'INVEST' | 'PASS'
  confidence: number        // 0–100
  reasoning: string
  pros: string[]
  cons: string[]
  summary: string
  companyName: string
  analyzedAt: string        // ISO timestamp
}

// What we send to the API route
export interface AnalyzeRequest {
  company: string
}

// What the API route sends back
export interface AnalyzeResponse {
  result?: AnalysisResult
  error?: string
}
