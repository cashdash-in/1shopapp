'use server';
/**
 * @fileOverview A sentiment analysis flow using Genkit with robust fallback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MODEL = 'googleai/gemini-1.5-flash';

const SentimentAnalysisInputSchema = z.object({
  text: z.string().describe('The feedback text to analyze.'),
  rating: z.number().describe('The star rating provided by the user.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']),
  categories: z.array(z.string()).describe('Categories like "UI/UX", "Performance", etc.'),
  summary: z.string().describe('A one-sentence summary.'),
});
export type SentimentOutput = z.infer<typeof SentimentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  model: MODEL,
  input: { schema: SentimentAnalysisInputSchema },
  output: { schema: SentimentOutputSchema },
  prompt: `Analyze feedback: "{{{text}}}" Rating: {{rating}}`,
});

export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  try {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    console.warn("Sentiment AI failed, using simulation:", error);
    const isHighRating = input.rating >= 4;
    return {
      sentiment: isHighRating ? 'Positive' : (input.rating <= 2 ? 'Negative' : 'Neutral'),
      categories: ["User Experience", "App Reliability"],
      summary: `User provided a ${input.rating}-star review highlighting general application usage.`
    };
  }
}