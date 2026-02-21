
'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 *
 * - analyzeData - A function that takes data and a question and returns an AI-powered analysis.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';

const DataAnalysisInputSchema = z.object({
  data: z.string().describe('The raw text or CSV data to analyze.'),
  question: z.string().describe('The question the user wants to answer about the data.'),
});

const DataAnalysisOutputSchema = z.object({
  summary: z.string().describe('A detailed summary answering the user question.'),
  data: z.string().optional().describe('The result data formatted as a Markdown table if applicable.'),
});

const prompt = ai.definePrompt({
  name: 'dataAnalysisPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: DataAnalysisInputSchema },
  output: { schema: DataAnalysisOutputSchema },
  prompt: `You are an expert Data Scientist.
  
  Analyze the following data to answer the user's question.
  
  Data:
  {{{data}}}
  
  Question:
  {{{question}}}
  
  Provide a detailed summary of your findings. If the answer involves structured data or filtering, provide that data as a Markdown table in the 'data' field.`,
});

const dataAnalysisFlow = ai.defineFlow(
  {
    name: 'dataAnalysisFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to analyze data.');
    return output;
  }
);

export async function analyzeData(
  input: DataAnalysisInput
): Promise<DataAnalysisOutput> {
  return dataAnalysisFlow(input);
}
