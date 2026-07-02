import { PromptTemplate } from '@langchain/core/prompts'

/**
 * Single LangChain prompt for the entire analysis.
 * We inject the raw research text gathered from web search,
 * and the LLM returns a structured JSON object.
 *
 * Keeping everything in one prompt keeps the architecture simple
 * and easy to explain in an interview.
 */
export const investmentPrompt = PromptTemplate.fromTemplate(`
You are a senior investment analyst. Based on the research below about {companyName}, 
produce a structured investment recommendation.

RESEARCH DATA:
{researchData}

Return ONLY valid JSON (no markdown, no extra text) in this exact shape:
{{
  "decision": "INVEST" or "PASS",
  "confidence": <integer 0-100>,
  "reasoning": "<2-3 sentence explanation of your decision>",
  "pros": ["<pro 1>", "<pro 2>", "<pro 3>"],
  "cons": ["<con 1>", "<con 2>", "<con 3>"],
  "summary": "<one short paragraph wrapping up the investment case>"
}}

Be honest and balanced. If data is limited, lower your confidence score accordingly.
`)
