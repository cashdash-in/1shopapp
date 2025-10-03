
'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports.
 */

import { ai } from '@/ai/genkit';
import {
  BiReportInputSchema,
  BiReportOutputSchema,
  type BiReportInput,
  type BiReportOutput,
} from '../schemas';

const biReportPrompt = ai.definePrompt({
    name: 'biReportPrompt',
    input: { schema: BiReportInputSchema },
    output: { schema: BiReportOutputSchema, format: 'json' },
    prompt: `
    You are a Business Intelligence (BI) Analyst. Your task is to analyze a dataset based on a user's request and generate a structured report suitable for visualization.

    -   **Title**: Create a descriptive title for the report.
    -   **Summary**: Write a one or two-sentence summary of the key insight.
    -   **ChartData**: Format the resulting data as an array of objects, each with a 'name' (for the x-axis label) and a 'value' (for the y-axis numerical value).

    Dataset:
    \`\`\`
    {{{data}}}
    \`\`\`

    User Request:
    "{{{request}}}"

    Generate the BI report based on the user's request.
    `,
});

const biReportFlow = ai.defineFlow(
  {
    name: 'biReportFlow',
    inputSchema: BiReportInputSchema,
    outputSchema: BiReportOutputSchema,
  },
  async (input) => {
    const { output } = await biReportPrompt(input);
    return output!;
  }
);

export async function generateBiReport(input: BiReportInput): Promise<BiReportOutput> {
    return biReportFlow(input);
}
