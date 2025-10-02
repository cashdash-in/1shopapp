'use server';

import { ai } from '@/ai/genkit';
import { BiReportInputSchema, BiReportOutputSchema, type BiReportInput, type BiReportOutput } from '../schemas';

export async function generateBiReport(input: BiReportInput): Promise<BiReportOutput> {
  return generateBiReportFlow(input);
}

const generateBiReportFlow = ai.defineFlow(
  {
    name: 'generateBiReportFlow',
    inputSchema: BiReportInputSchema,
    outputSchema: BiReportOutputSchema,
  },
  async (input) => {
    
    const prompt = ai.definePrompt({
        name: 'biReportPrompt',
        input: { schema: BiReportInputSchema },
        output: { schema: BiReportOutputSchema, format: 'json' },
        prompt: `You are a Business Intelligence Analyst. Your task is to analyze the provided data and generate a report that answers the user's request.

        - Analyze the data to understand its structure and content.
        - Create a concise title for the report based on the user's request.
        - Write a one or two-sentence summary of the key insight from the data.
        - Generate an array of data points suitable for a bar chart. Each point should have a 'name' (string label for x-axis) and a 'value' (numerical).

        DATASET:
        \`\`\`
        ${input.data}
        \`\`\`

        USER REQUEST: "${input.request}"

        Your response MUST be in the specified JSON format.
        `,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a BI report.");
    }
    
    // Sanitize data to ensure values are numbers
    const sanitizedChartData = output.chartData.map(item => ({
      name: String(item.name),
      value: Number(item.value) || 0
    }));

    return {
      ...output,
      chartData: sanitizedChartData,
    };
  }
);