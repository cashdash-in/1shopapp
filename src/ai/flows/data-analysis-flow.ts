
'use server';
/**
 * @fileOverview An AI flow for analyzing data and answering user questions.
 * 
 * - analyzeData - A function that takes data and a question, and returns an analysis.
 */

import { ai } from '@/ai/genkit';
import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';
import { DataAnalysisInputSchema, DataAnalysisOutputSchema } from '../schemas';
import { z } from 'zod';

// The main function that clients will call.
export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
    const result = await dataAnalysisFlow(input);
    return result;
}

const analysisTool = ai.defineTool(
    {
        name: 'dataAnalysisTool',
        description: 'Analyzes data to answer a question and provides a summary and optional data table.',
        inputSchema: DataAnalysisOutputSchema,
        outputSchema: DataAnalysisOutputSchema,
    },
    async (input) => input
);

// Define the Genkit flow
const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview',
        tools: [analysisTool],
        prompt: `You are an expert data analyst. Your task is to analyze the provided dataset based on the user's question.
Use the dataAnalysisTool to format your answer.

### Instructions:
1.  Analyze the data to answer the user's question.
2.  Provide a concise, text-based 'summary' of your findings.
3.  If the question requires a table of results (e.g., 'total sales per region', 'top 5 products'), create a 'data' field containing the result as a markdown table. If the answer is just text, you can omit the 'data' field.

### Dataset:
${input.data}

### User's Question:
"${input.question}"
`,
    });

    const analysis = output?.toolRequest?.input;

    if (!analysis) {
        throw new Error("The AI model did not return a valid analysis structure.");
    }
    
    // The model output needs to be parsed if it's a string
    return typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
  }
);
