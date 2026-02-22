'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports.
 *
 * - generateBiReport - A function that analyzes data and returns BI insights.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { BiReportInput, BiReportOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash';

const BiReportInputSchema = z.object({
  data: z.string().describe('The raw data (CSV or text) to analyze.'),
  request: z.string().describe('The specific report or visualization requested by the user.'),
});

const BiReportOutputSchema = z.object({
  title: z.string().describe('A descriptive title for the report chart.'),
  summary: z.string().describe('A high-level business summary of the insights found.'),
  chartData: z.array(z.object({
    name: z.string().describe('The label for the data point.'),
    value: z.number().describe('The numerical value for the data point.'),
  })).describe('Structured data for rendering a bar chart.'),
});

const prompt = ai.definePrompt({
  name: 'biReportPrompt',
  model: MODEL,
  input: { schema: BiReportInputSchema },
  output: { schema: BiReportOutputSchema },
  prompt: `You are a professional Business Intelligence Analyst.
  
  Analyze the following data based on the user's request.
  
  Data:
  {{{data}}}
  
  Request:
  {{{request}}}
  
  Provide a concise summary of the key findings and a structured list of data points suitable for a bar chart.`,
});

const biReportFlow = ai.defineFlow(
  {
    name: 'biReportFlow',
    inputSchema: BiReportInputSchema,
    outputSchema: BiReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate BI report.');
    return output;
  }
);

export async function generateBiReport(
  input: BiReportInput
): Promise<BiReportOutput> {
  return biReportFlow(input);
}
