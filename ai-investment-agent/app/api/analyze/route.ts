import { NextRequest, NextResponse } from 'next/server'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { investmentPrompt } from '@/app/lib/prompt'
import { gatherResearch } from '@/app/utils/research'
import type { AnalysisResult } from '@/app/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json()

    // Basic input validation
    if (!company || typeof company !== 'string' || company.trim().length === 0) {
      return NextResponse.json({ error: 'Company name is required.' }, { status: 400 })
    }

    const companyName = company.trim()

    // Step 1: Gather public research about the company
    const researchData = await gatherResearch(companyName)

    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-3.5-flash',
      temperature: 0.3,
      apiKey: process.env.GEMINI_API_KEY,
      maxRetries: 1,
    })

    // Step 3: Fill in the prompt template with our data
    const formattedPrompt = await investmentPrompt.format({
      companyName,
      researchData,
    })

    // Step 4: Send to LLM and get response
    const response = await llm.invoke(formattedPrompt)

    // Step 5: Parse the JSON response from the LLM
    const content = response.content as string
    const parsed = JSON.parse(content)

    // Build the final result object
    const result: AnalysisResult = {
      ...parsed,
      companyName,
      analyzedAt: new Date().toISOString(),
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Analysis error:', error)

    // Check for JSON parse errors (LLM gave malformed output)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'The AI returned an unexpected format. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Analysis failed. Check your API keys and try again.' },
      { status: 500 }
    )
  }
}
