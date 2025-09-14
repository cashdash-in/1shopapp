
'use server';
/**
 * @fileOverview An AI flow for analyzing data and answering user questions.
 * 
 * - analyzeData - A function that takes data and a question, and returns an analysis.
 */

import { ai } from '@/ai/genkit';
import { DataAnalysisInputSchema, DataAnalysisOutputSchema, type DataAnalysisInput, type DataAnalysisOutput } from '../schemas';

// The main function that clients will call.
export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
  const result = await dataAnalysisFlow(input);
  return result;
}

// Define the prompt for the AI model
const dataAnalysisPrompt = ai.definePrompt({
  name: 'dataAnalysisPrompt',
  input: { schema: DataAnalysisInputSchema },
  output: { schema: DataAnalysisOutputSchema },
  model: 'googleai/gemini-2.5-flash-preview',
  prompt: `You are an expert data analyst. Your task is to analyze the provided dataset and answer the user's question about it.

Data:
---
{{{data}}}
---

User's Question:
"{{{question}}}"

Analyze the data to answer the question. Provide a concise, text-based summary of your findings. If your analysis produces a table of data, provide it in the 'data' field as a markdown-formatted string.
`,
});

// Define the Genkit flow
const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await dataAnalysisPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid analysis.");
    }
    return output;
  }
);
