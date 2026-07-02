/**
 * research.ts
 *
 * Gathers public information about a company using Tavily's search API.
 * Tavily is a search API built for AI agents — it returns clean, summarized
 * results perfect for feeding into an LLM.
 *
 * We run several targeted searches in parallel to cover different angles:
 * overview, financials, risks, competitors, and recent news.
 */

interface TavilyResult {
  title: string
  content: string
  url: string
}

interface TavilyResponse {
  results: TavilyResult[]
}

// Run a single Tavily search query and return the top results
async function tavilySearch(query: string): Promise<string> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 3,
    }),
  })

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.statusText}`)
  }

  const data: TavilyResponse = await response.json()

  // Combine the top result snippets into a single string block
  return data.results
    .map((r) => `[${r.title}]\n${r.content.slice(0, 400)}`)
    .join('\n\n')
}

/**
 * Main function: runs 5 targeted searches in parallel and returns
 * a single combined research string to feed into the LLM.
 */
export async function gatherResearch(companyName: string): Promise<string> {
  // Run all searches at the same time to keep things fast
  const [overview, financials, risks, competitors, news] = await Promise.all([
    tavilySearch(`${companyName} company overview business model industry`),
    tavilySearch(`${companyName} revenue growth financial performance 2024`),
    tavilySearch(`${companyName} risks challenges problems 2024`),
    tavilySearch(`${companyName} competitors market competition`),
    tavilySearch(`${companyName} latest news 2024 2025`),
  ])

  // Format into labelled sections so the LLM can easily parse them
  return `
=== COMPANY OVERVIEW & BUSINESS MODEL ===
${overview}

=== FINANCIALS & REVENUE GROWTH ===
${financials}

=== RISKS & CHALLENGES ===
${risks}

=== COMPETITORS ===
${competitors}

=== RECENT NEWS ===
${news}
`.trim()
}
