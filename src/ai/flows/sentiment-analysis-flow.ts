'use server';
/**
 * @fileOverview A sentiment analysis flow that uses Genkit.
 */
import {
  type SentimentAnalysisInput,
  type SentimentOutput,
} from '../schemas';


export async function runSentimentAnalysis(
  input: SentimentAnalysisInput
): Promise<SentimentOutput> {
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
