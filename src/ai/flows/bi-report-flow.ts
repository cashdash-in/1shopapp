'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports.
 */
// import { ai } from '@/ai/genkit';
import {
  BiReportInputSchema,
  BiReportOutputSchema,
  type BiReportInput,
  type BiReportOutput,
} from '../schemas';

// const prompt = ai.definePrompt(
//   {
//     name: 'biReportPrompt',
//     input: { schema: BiReportInputSchema },
//     output: { schema: BiReportOutputSchema, format: 'json' },
//     prompt: `You are a Business Intelligence Analyst.
// Analyze the following data and generate a report based on the user's request.
// The report should include a title, a brief summary, and data formatted for a chart.

// Data:
// {{{data}}}

// Request:
// {{{request}}}

// Provide a clear and concise title for the report.
// The summary should highlight the key insight from the data.
// The chartData should be an array of objects with 'name' and 'value' properties, suitable for a bar chart.`,
//   }
// );

export async function generateBiReport(
  input: BiReportInput
): Promise<BiReportOutput> {
  // const { output } = await prompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
