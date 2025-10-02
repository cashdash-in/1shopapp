
'use server';
/**
 * @fileOverview An AI flow for generating Business Intelligence reports from data.
 * 
 * - generateBiReport - A function that takes data and a request, and returns a BI report structure.
 */

import { ai } from '@/ai/genkit';
import { BiReportInputSchema, BiReportOutputSchema, type BiReportInput, type BiReportOutput } from '../schemas';

// The main function that clients will call.
export async function generateBiReport(input: BiReportInput): Promise<BiReportOutput> {
  const result = await biReportFlow(input);
  return result;
}

// Define the prompt for the AI model
const biReportPrompt = ai.definePrompt({
  name: 'biReportPrompt',
  input: { schema: BiReportInputSchema },
  output: { schema: BiReportOutputSchema, format: 'json' },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert BI (Business Intelligence) analyst. Your task is to create a report based on a user's request and a provided dataset.

User's Request:
"{{{request}}}"

Dataset:
\`\`\`
{{{data}}}
\`\`\`

Generate a report that includes:
1. A concise, one or two-sentence summary of the key insight.
2. A clear title for the report.
3. The data for a chart, formatted as an array of objects with 'name' (string) and 'value' (number) fields. The 'value' field in chartData MUST be a number, not a string.
`,
});


// Define the Genkit flow
const biReportFlow = ai.defineFlow(
  {
    name: 'biReportFlow',
    inputSchema: BiReportInputSchema,
    outputSchema: BiReportOutputSchema,
  },
  async (input) => {
    const { output } = await biReportPrompt(input);

    if (!output) {
        throw new Error("The AI model did not return a valid report structure.");
    }

    // Data sanitation to ensure chart values are numbers
    const sanitizedChartData = output.chartData.map(item => ({
        ...item,
        value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
    }));

    return {
        ...output,
        chartData: sanitizedChartData,
    };
  }
);
