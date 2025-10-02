
'use server';
/**
 * @fileOverview An AI flow for analyzing data and answering user questions.
 * 
 * - analyzeData - A function that takes data and a question, and returns an analysis.
 */

import { ai } from '@/ai/genkit';
import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';
import { DataAnalysisInputSchema, DataAnalysisOutputSchema } from '../schemas';

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
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert data analyst. Your task is to analyze the provided dataset and answer the user's question about it.

User's Question:
"{{{question}}}"

Dataset:
\`\`\`
{{{data}}}
\`\`\`

Based on the data and the question, provide a text-based summary that directly answers the question.
If the answer involves a subset of the data or a calculation, also provide the resulting data as a markdown table in the 'data' field of the output.
`,
});


// Define the Genkit flow to call the prompt correctly.
const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await dataAnalysisPrompt(input);

    if (!output) {
      throw new Error("AI could not analyze your data. The model did not return a valid response.");
    }
    
    return output;
  }
);
