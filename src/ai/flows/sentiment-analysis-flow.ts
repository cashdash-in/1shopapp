
'use server';
/**
 * @fileOverview An AI flow for analyzing customer sentiment.
 *
 * - analyzeSentiment - A function that analyzes the sentiment of a given text.
 * - SentimentInput - The input type for the analyzeSentiment function.
 * - SentimentOutput - The return type for the analyzeSentiment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema for the sentiment analysis flow
const SentimentInputSchema = z.object({
  text: z.string().describe('The customer feedback text to be analyzed.'),
});
export type SentimentInput = z.infer<typeof SentimentInputSchema>;


// Define the output schema for the sentiment analysis flow
const SentimentOutputSchema = z.object({
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('The overall sentiment of the text.'),
  categories: z.array(z.string()).describe('A list of categories the feedback falls into (e.g., "UI/UX", "App Performance", "Feature Request").'),
  summary: z.string().describe('A brief summary of the feedback provided.'),
});
export type SentimentOutput = z.infer<typeof SentimentOutputSchema>;


// The main function that clients will call to analyze sentiment
export async function analyzeSentiment(input: SentimentInput): Promise<SentimentOutput> {
  return sentimentAnalysisFlow(input);
}


// Define the prompt for the AI model
const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: { schema: SentimentInputSchema },
  output: { schema: SentimentOutputSchema },
  prompt: `You are an expert in customer feedback analysis. Your task is to analyze the following customer feedback text, determine its sentiment, categorize it, and provide a concise summary.

Customer Feedback:
"{{{text}}}"

Analyze the feedback and provide the output in the specified JSON format.
- "sentiment": Classify the sentiment as "Positive", "Negative", or "Neutral".
- "categories": Identify relevant categories. Possible categories include, but are not limited to: UI/UX, App Performance, Feature Request, Bug Report, Customer Service, Brand Experience.
- "summary": Provide a one-sentence summary of the core feedback.
`,
});


// Define the Genkit flow for sentiment analysis
const sentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'sentimentAnalysisFlow',
    inputSchema: SentimentInputSchema,
    outputSchema: SentimentOutputSchema,
  },
  async (input) => {
    const { output } = await sentimentAnalysisPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output.");
    }
    return output;
  }
);
