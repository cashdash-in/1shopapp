
'use server';
/**
 * @fileOverview An AI flow for analyzing customer sentiment on-demand.
 *
 * - runSentimentAnalysis - A function that analyzes the sentiment of a given text.
 */

import { ai } from '@/ai/genkit';
import { SentimentAnalysisInputSchema, SentimentOutputSchema, type SentimentAnalysisInput, type SentimentOutput } from '../schemas';

// The main function that clients will call to analyze sentiment.
// This function does NOT store the result. The client is responsible for that.
export async function runSentimentAnalysis(input: SentimentAnalysisInput): Promise<SentimentOutput> {
  const analysisResult = await sentimentAnalysisFlow(input);
  return analysisResult;
}

// Define the prompt for the AI model
const sentimentAnalysisPrompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: { schema: SentimentAnalysisInputSchema },
  output: { schema: SentimentOutputSchema },
  prompt: `You are an expert in customer feedback analysis. Your task is to analyze the following customer feedback text, which is accompanied by a star rating, determine its sentiment, categorize it, and provide a concise summary.

Customer Feedback:
"{{{text}}}"

Star Rating: {{{rating}}} out of 5.

Use the star rating as a strong indicator of sentiment. A low rating (1-2 stars) is likely Negative, a high rating (4-5 stars) is likely Positive, and 3 stars could be Neutral or mixed. Your text analysis should clarify the specifics.

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
    inputSchema: SentimentAnalysisInputSchema,
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
