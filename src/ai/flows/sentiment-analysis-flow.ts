
'use server';
/**
 * @fileOverview A sentiment analysis flow that uses Genkit.
 */
import type { SentimentAnalysisInput, SentimentOutput, } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function runSentimentAnalysis(
  input: SentimentAnalysisInput
): Promise<SentimentOutput> {
  throw new Error(AI_DISABLED_ERROR);
}
