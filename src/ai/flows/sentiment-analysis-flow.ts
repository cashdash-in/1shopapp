'use server';
/**
 * @fileOverview A sentiment analysis flow that uses Genkit.
 */

// import { ai } from '@/ai/genkit';
import {
  SentimentAnalysisInputSchema,
  SentimentOutputSchema,
  type SentimentAnalysisInput,
  type SentimentOutput,
} from '../schemas';

export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  throw new Error("AI functionality is temporarily disabled due to installation issues.");
}

/*
const sentimentAnalysisPrompt = ai.definePrompt(
  {
    name: 'sentimentAnalysisPrompt',
    input: { schema: SentimentAnalysisInputSchema },
    output: { schema: SentimentOutputSchema, format: 'json' },
    prompt: `
    You are an expert at analyzing customer feedback.
    Analyze the following feedback text and provide:
    1. The overall sentiment (Positive, Negative, or Neutral).
    2. A list of relevant categories (e.g., "UI/UX", "Bug Report", "Feature Request", "App Performance").
    3. A concise, one-sentence summary of the core feedback.

    Feedback Text:
    {{text}}
    `,
  }
);


const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentOutputSchema,
  },
  async (input) => {
    const { output } = await sentimentAnalysisPrompt(input);
    return output!;
  }
);


export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  return sentimentAnalysisFlow(input);
}
*/
