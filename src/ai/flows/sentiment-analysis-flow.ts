'use server';
/**
 * @fileOverview A sentiment analysis flow that uses Genkit.
 */
import type { SentimentAnalysisInput, SentimentOutput } from '../schemas';

const errorMessage = "AI functionality is temporarily disabled due to a package installation issue. Please contact support.";

export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  console.error(errorMessage);
  throw new Error(errorMessage);
}
