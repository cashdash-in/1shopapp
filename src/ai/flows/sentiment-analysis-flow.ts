
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


// NOTE: This is a hack for the prototype to persist data.
// In a real app, you would use a proper database like Firestore.
async function persistFeedback(newFeedback: SentimentAnalysis) {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'feedback-db.ts');
    
    // Create a string representation of the new feedback object
    const newFeedbackString = `
    {
        id: "${newFeedback.id}",
        submittedAt: "${newFeedback.submittedAt}",
        feedback: { text: \`${newFeedback.feedback.text.replace(/`/g, '\\`')}\` },
        analysis: {
            sentiment: "${newFeedback.analysis.sentiment}",
            categories: [${newFeedback.analysis.categories.map(c => `"${c}"`).join(', ')}],
            summary: \`${newFeedback.analysis.summary.replace(/`/g, '\\`')}\`,
        }
    },`;

    try {
        let fileContent = await fs.readFile(dbPath, 'utf-8');
        
        const insertionIndex = fileContent.lastIndexOf('];');
        if (insertionIndex === -1) {
            throw new Error("Could not find the end of FAKE_FEEDBACK_DB array in feedback-db.ts");
        }

        const updatedContent = fileContent.slice(0, insertionIndex) + newFeedbackString + fileContent.slice(insertionIndex);
        
        await fs.writeFile(dbPath, updatedContent, 'utf-8');
        
        FAKE_FEEDBACK_DB.unshift(newFeedback);
        console.log('Successfully persisted new feedback.');
    } catch (error) {
        console.error("!!! FAILED TO PERSIST FEEDBACK TO FILE !!!", error);
        FAKE_FEEDBACK_DB.unshift(newFeedback);
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
