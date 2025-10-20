'use server';
/**
 * @fileOverview A sentiment analysis flow that uses Genkit.
 */
// import {ai} from '@/ai/genkit';
// import {
//   SentimentAnalysisInputSchema,
//   type SentimentAnalysisInput,
//   SentimentOutputSchema,
//   type SentimentOutput,
// } from '../schemas';

// const sentimentAnalysisPrompt = ai.definePrompt({
//   name: 'sentimentAnalysisPrompt',
//   input: {schema: SentimentAnalysisInputSchema},
//   output: {schema: SentimentOutputSchema},
//   prompt: `Analyze the sentiment of the following customer feedback.

// Categorize the feedback into relevant topics like "UI/UX", "App Performance", "Feature Request", or "Bug Report".
// Determine if the overall sentiment is Positive, Negative, or Neutral.
// Provide a concise, one-sentence summary of the user's core message.

// Feedback:
// """
// {{text}}
// """

// Star Rating: {{rating}}/5
// `,
// });

export async function runSentimentAnalysis(
  input: any
): Promise<any> {
  // const {output} = await sentimentAnalysisPrompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
