
'use server';

import type { SentimentAnalysisInput, SentimentOutput } from '../schemas';

export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  throw new Error("AI functionality is temporarily disabled due to a build issue.");
}
