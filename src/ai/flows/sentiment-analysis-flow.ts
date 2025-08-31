
'use server';
/**
 * @fileOverview An AI flow for analyzing and storing customer sentiment.
 *
 * - analyzeAndStoreSentiment - A function that analyzes the sentiment of a given text and stores it.
 * - getSentimentFeedback - A function to retrieve all stored feedback.
 */

import { ai } from '@/ai/genkit';
import { FAKE_FEEDBACK_DB } from '@/lib/feedback-db';
import fs from 'fs/promises';
import path from 'path';
import { SentimentAnalysisSchema, type SentimentAnalysis, SentimentInputSchema, type SentimentInput, SentimentOutputSchema } from '../schemas';

// Helper function to stringify a feedback object for file writing
function stringifyFeedback(feedback: SentimentAnalysis): string {
    const analysisCategories = feedback.analysis.categories.map(c => `"${c}"`).join(', ');
    const fields = [
        `id: "${feedback.id}"`,
        `submittedAt: "${feedback.submittedAt}"`,
        `feedback: { text: \`${feedback.feedback.text.replace(/`/g, '\\`')}\` }`,
        `analysis: {
            sentiment: "${feedback.analysis.sentiment}",
            categories: [${analysisCategories}],
            summary: \`${feedback.analysis.summary.replace(/`/g, '\\`')}\`,
        }`
    ].join(',\n        ');

    return `    {\n        ${fields}\n    }`;
}


// NOTE: This is a hack for the prototype to persist data.
// In a real app, you would use a proper database like Firestore.
async function persistFeedback(newFeedback: SentimentAnalysis) {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'feedback-db.ts');

    // First, update the in-memory array for the current request
    FAKE_FEEDBACK_DB.unshift(newFeedback);
    
    // Now, regenerate the entire feedback-db.ts file content from the updated in-memory array
    const allFeedbackString = FAKE_FEEDBACK_DB.map(stringifyFeedback).join(',\n');

    const fileContent = `
import type { SentimentAnalysis } from "@/ai/schemas";

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user feedback database.
// New feedback will be prepended to this array.
export const FAKE_FEEDBACK_DB: SentimentAnalysis[] = [
${allFeedbackString}
];
`.trimStart();
    
    try {
        await fs.writeFile(dbPath, fileContent, 'utf-8');
        console.log('Successfully persisted new feedback by regenerating feedback-db.ts');
    } catch (error) {
        console.error("!!! FAILED TO PERSIST FEEDBACK TO FILE !!!", error);
        // The in-memory array is already updated, so the current request will work.
        // Subsequent requests on new server instances will have the old data until the file is writable.
    }
}


// The main function that clients will call to analyze sentiment and store it
export async function analyzeAndStoreSentiment(input: SentimentInput): Promise<SentimentAnalysis> {
  const analysisResult = await sentimentAnalysisFlow(input);

  const fullFeedback: SentimentAnalysis = {
    id: `fb_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    feedback: input,
    analysis: analysisResult,
  };

  await persistFeedback(fullFeedback);
  return fullFeedback;
}

// Function to retrieve all feedback
export async function getSentimentFeedback(): Promise<SentimentAnalysis[]> {
    // In a real app, you'd fetch this from your database.
    return Promise.resolve(FAKE_FEEDBACK_DB);
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
