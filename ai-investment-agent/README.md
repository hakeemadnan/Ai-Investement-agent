# AI Investment Research Agent

## Overview

This is an AI-powered web app that takes a company name and returns a structured investment analysis: an INVEST/PASS decision, a confidence score, reasoning, pros, cons, and a summary.

The user types a company name into a single input field and clicks Analyze. The app searches the web for current public information about that company (overview, financials, risks, competitors, recent news), feeds that research into an LLM through one prompt, and displays the structured result in a clean card UI.

It's built as a simple, single-prompt agent — no multi-agent orchestration, no LangGraph — to keep the architecture easy to reason about and explain.

---

## How to Run It

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in two keys:

| Variable         | Where to get it                                                      |
| ---------------- | -------------------------------------------------------------------- |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `TAVILY_API_KEY` | [tavily.com](https://tavily.com) (free tier)                         |

> Note: the project also supports Gemini as a drop-in alternative to OpenAI (swap the model client in `app/api/analyze/route.ts`). I tested both — see **Key Decisions & Trade-offs** below for why I ultimately stuck with OpenAI.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and type a company name.

---

## How It Works

**Flow:**

```
User types company name
        │
        ▼
page.tsx  →  POST /api/analyze
        │
        ▼
app/api/analyze/route.ts
        │
        ├─► app/utils/research.ts
        │     Runs 5 Tavily searches in parallel:
        │     overview, financials, risks, competitors, news
        │
        ├─► app/lib/prompt.ts
        │     One LangChain PromptTemplate fills in the
        │     research text and company name
        │
        ▼
   OpenAI GPT-4.1-mini (via LangChain's ChatOpenAI)
        │
        ▼
   Returns structured JSON: decision, confidence,
   reasoning, pros, cons, summary
        │
        ▼
ResultCard.tsx renders it in a card UI
```

**Why this approach:**

- **One prompt, one LLM call.** All the research is gathered first, then handed to the LLM in a single structured request. There's no back-and-forth between multiple agents — the LLM just reasons over the data it's given once.
- **Search before reasoning.** The LLM doesn't have live knowledge of a company's current state, so Tavily search fills that gap with real, current web data before the LLM ever runs.
- **Structured JSON output.** The prompt explicitly asks for a fixed JSON shape, so the frontend can render it predictably without extra parsing logic.

---

## Key Decisions & Trade-offs

**Decided to use:**

- **Next.js App Router + API routes** — keeps frontend and backend in one project, simple to run and deploy.
- **Tavily for search** — purpose-built for feeding LLMs (cleaner output than scraping raw HTML myself).
- **Single LangChain prompt, no agents/LangGraph** — the task doesn't need multi-step planning or tool-calling loops; one well-structured prompt is enough and is much easier to debug and explain.
- **Gemini 3.5** — cheaper, faster, and accurate enough for this use case.

### Example 1 — Apple

```json
{
  "decision": "INVEST",
  "confidence": 78,
  "reasoning": "Apple maintains dominant market position with strong brand loyalty and a growing services segment that provides recurring revenue. However, China dependency and slowing iPhone upgrade cycles present meaningful near-term headwinds.",
  "pros": [
    "World's most valuable brand with exceptional customer retention",
    "Services segment (App Store, iCloud, Apple TV+) growing at 15%+ YoY",
    "Strong balance sheet with significant cash reserves"
  ],
  "cons": [
    "Heavy revenue dependence on China",
    "iPhone upgrade cycle slowing as hardware innovation plateaus",
    "Increasing regulatory pressure in EU and US markets"
  ],
  "summary": "Apple remains a fundamentally strong business with durable competitive advantages. The shift toward services is a positive structural trend, though current valuations already price in a lot of good news."
}
```

### Example 2 — A smaller/less-covered company (lower confidence case)

When tested with a less prominent or recently founded company, the agent correctly returned a lower confidence score (around 40-50%) and explicitly noted in its reasoning that limited public data was available — rather than confidently inventing details. This was an intentional design goal: the prompt instructs the model to lower confidence when research data is thin, instead of hallucinating specifics.

### Example 3 — Tesla

```json
{
  "decision": "PASS",
  "confidence": 62,
  "reasoning": "Tesla's valuation already reflects aggressive growth assumptions while EV competition intensifies globally and margins have compressed due to price cuts. Strong brand and tech leadership are offset by execution risk on newer initiatives.",
  "pros": [
    "Leading brand recognition in the EV space",
    "Vertical integration across batteries, software, and manufacturing",
    "Expanding into energy storage and autonomous driving"
  ],
  "cons": [
    "Margin compression from repeated price cuts",
    "Intensifying competition from legacy automakers and Chinese EV makers",
    "Valuation premium leaves little room for execution missteps"
  ],
  "summary": "Tesla remains an innovative leader but faces a tougher competitive and margin environment than in prior years. At current valuation levels, the risk-reward is less compelling for new positions."
}
```

_(Note: these outputs vary slightly each run since LLM responses aren't deterministic and search results change over time — these are representative samples from testing, not guaranteed exact reproductions.)_

---

## What I Would Improve With More Time

- **Caching layer** — store recent analyses (Redis or even a simple JSON file/SQLite) so repeated lookups don't re-run the full pipeline.
- **Streaming UI** — show research progress (e.g. "Checking financials...", "Checking competitors...") instead of one long spinner.
- **Source citations** — show the actual URLs Tavily pulled from underneath each section, so users can verify claims themselves.
- **Confidence calibration** — right now confidence is purely the LLM's self-reported number; I'd want to validate this against real outcomes over time rather than trusting it blindly.
- **Rate limiting & error resilience** — add retry logic with exponential backoff on the research step, and friendlier handling for cases where a search provider is down or a key has hit a quota.
- **Side-by-side comparison mode** — let users compare two companies in one view instead of one at a time.

---

## Tech Stack

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| Frontend         | Next.js 14 (App Router), React, TailwindCSS |
| Backend          | Next.js API Routes                          |
| AI Orchestration | LangChain.js                                |
| LLM              | Gemini 3.5                                  |
| Web Research     | Tavily Search API                           |
| Language         | TypeScript                                  |


DEPLOYED ON VERCEL
visit - [ai-investment-agent-sage.vercel.app](https://ai-investment-agent-sage.vercel.app/)


