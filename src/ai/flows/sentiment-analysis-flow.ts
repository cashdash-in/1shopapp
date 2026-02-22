'use server';
/**
 * @fileOverview A sentiment analysis flow using Genkit.
 *
 * - runSentimentAnalysis - A function that analyzes user feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  text: z.string().describe('The feedback text to analyze.'),
  rating: z.number().describe('The star rating provided by the user.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']),
  categories: z.array(z.string()).describe('Categories like "UI/UX", "App Performance", "Feature Request", etc.'),
  summary: z.string().describe('A one-sentence summary of the user feedback.'),
});
export type SentimentOutput = z.infer<typeof SentimentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  model: 'gemini-1.5-flash',
  input: { schema: SentimentAnalysisInputSchema },
  output: { schema: SentimentOutputSchema },
  prompt: `Analyze the following user feedback for a mobile app aggregator named 1ShopApp.
  
  Feedback: "{{{text}}}"
  Rating: {{rating}} stars
  
  Identify the overall sentiment, the relevant categories, and provide a concise summary.`,
});

const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to analyze feedback.');
    return output;
  }
);

export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  return sentimentAnalysisFlow(input);
}
