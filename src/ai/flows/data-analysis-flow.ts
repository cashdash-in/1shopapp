'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 */
// import { ai } from '@/ai/genkit';
import {
  DataAnalysisInputSchema,
  DataAnalysisOutputSchema,
  type DataAnalysisInput,
  type DataAnalysisOutput,
} from '../schemas';

// const prompt = ai.definePrompt(
//   {
//     name: 'dataAnalysisPrompt',
//     input: { schema: DataAnalysisInputSchema },
//     output: { schema: DataAnalysisOutputSchema, format: 'json' },
//     prompt: `You are a data analyst.
// Analyze the provided data based on the user's question.
// Provide a text summary of your findings.
// If applicable, also provide the resulting data in a markdown table format.

// Data:
// {{{data}}}

// Question:
// {{{question}}}
// `,
//   }
// );

export async function analyzeData(
  input: DataAnalysisInput
): Promise<DataAnalysisOutput> {
  // const { output } = await prompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
