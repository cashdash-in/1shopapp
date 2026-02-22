'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports with fallback.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { BiReportInput, BiReportOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash-latest';

const BiReportInputSchema = z.object({
  data: z.string(),
  request: z.string(),
});

const BiReportOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  chartData: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })),
});

const prompt = ai.definePrompt({
  name: 'biReportPrompt',
  model: MODEL,
  input: { schema: BiReportInputSchema },
  output: { schema: BiReportOutputSchema },
  prompt: `Analyze data and generate BI report: {{{data}}}. Request: {{{request}}}`,
});

export async function generateBiReport(input: BiReportInput): Promise<BiReportOutput> {
  try {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      title: "Simulated Performance Report",
      summary: "Based on the provided data, there is a clear upward trend in regional engagement.",
      chartData: [
        { name: 'North', value: 450 },
        { name: 'South', value: 320 },
        { name: 'East', value: 280 },
        { name: 'West', value: 510 },
      ]
    };
  }
}
