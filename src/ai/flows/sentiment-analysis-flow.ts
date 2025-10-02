'use server';

import { ai } from '@/ai/genkit';
import { SentimentAnalysisInputSchema, SentimentOutputSchema, type SentimentAnalysisInput, type SentimentOutput } from '../schemas';

export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  return runSentimentAnalysisFlow(input);
}

const runSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'runSentimentAnalysisFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentOutputSchema,
  },
  async (input) => {
    
    const prompt = ai.definePrompt({
        name: 'sentimentAnalysisPrompt',
        input: { schema: SentimentAnalysisInputSchema },
        output: { schema: SentimentOutputSchema, format: 'json' },
        prompt: `Analyze the sentiment of the following customer feedback. 
        
        - The overall sentiment must be one of: 'Positive', 'Negative', or 'Neutral'.
        - Identify a list of relevant categories (e.g., "UI/UX", "App Performance", "Feature Request", "Bug Report").
        - Provide a brief, neutral summary of the feedback.

        RATING: ${input.rating} out of 5
        FEEDBACK: "${input.text}"

        Your response must be in the specified JSON format.
        `,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to analyze sentiment.");
    }
    return output;
  }
);