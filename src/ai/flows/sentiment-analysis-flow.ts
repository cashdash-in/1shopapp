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

// const prompt = ai.definePrompt({
//   name: 'sentimentAnalysisPrompt',
//   input: { schema: SentimentAnalysisInputSchema },
//   output: { schema: SentimentOutputSchema, format: 'json' },
//   prompt: `Analyze the sentiment of the following customer feedback.
// Determine if the sentiment is Positive, Negative, or Neutral.
// Also, categorize the feedback into relevant topics (e.g., "UI/UX", "Bug Report", "Feature Request", "App Performance").
// Finally, provide a concise one-sentence summary of the feedback.

// Rating: {{{rating}}}
// Feedback:
// "{{{text}}}"`,
// });

export async function runSentimentAnalysis(
  input: SentimentAnalysisInput
): Promise<SentimentOutput> {
  // const { output } = await prompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
