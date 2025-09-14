
'use 'use server';
/**
 * @fileOverview An AI flow for analyzing data and answering user questions.
 * 
 * - analyzeData - A function that takes data and a question, and returns an analysis.
 */

import { ai } from '@/ai/genkit';
import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';

// The main function that clients will call.
export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
    const result = await dataAnalysisFlow(input);
    return result;
}

// Define the prompt for the AI model
const dataAnalysisPrompt = ai.definePrompt({
  name: 'dataAnalysisPrompt',
  input: { schema: DataAnalysisInput },
  output: { schema: DataAnalysisOutput, format: 'json' },
  model: 'googleai/gemini-2.5-flash-preview',
  prompt: `You are an expert data analyst. Your task is to analyze the provided dataset based on the user's question.

### Dataset:
{{{data}}}

### User's Question:
"{{{question}}}"

### Instructions:
1.  Analyze the data to answer the user's question.
2.  Provide a concise, text-based 'summary' of your findings.
3.  If the question requires a table of results (e.g., 'total sales per region', 'top 5 products'), create a 'data' field containing the result as a markdown table. If the answer is just text, you can omit the 'data' field.
4.  Ensure your entire output is in the specified JSON format.
`,
});

// Define the Genkit flow
const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInput,
    outputSchema: DataAnalysisOutput,
  },
  async (input) => {
    const { output } = await dataAnalysisPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid analysis structure.");
    }
    return output;
  }
);
