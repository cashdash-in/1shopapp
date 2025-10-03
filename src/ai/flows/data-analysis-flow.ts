
'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 */

import { ai } from '@/ai/genkit';
import {
  DataAnalysisInputSchema,
  DataAnalysisOutputSchema,
  type DataAnalysisInput,
  type DataAnalysisOutput,
} from '../schemas';


const dataAnalysisPrompt = ai.definePrompt({
    name: 'dataAnalysisPrompt',
    input: { schema: DataAnalysisInputSchema },
    output: { schema: DataAnalysisOutputSchema, format: 'json' },
    prompt: `
    You are an expert data analyst.
    Your task is to analyze the provided data to answer the user's question.
    Provide a text-based summary of your findings. If the result of the query is tabular data, also provide it in markdown table format.

    Data:
    \`\`\`
    {{{data}}}
    \`\`\`

    Question:
    "{{{question}}}"

    Analyze the data and answer the question.
    `,
});

const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await dataAnalysisPrompt(input);
    return output!;
  }
);

export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
    return dataAnalysisFlow(input);
}
