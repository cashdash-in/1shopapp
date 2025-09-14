
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
  output: { schema: BiReportOutputSchema },
  model: 'googleai/gemini-2.5-flash-preview',
  prompt: `You are an expert BI (Business Intelligence) analyst. Your task is to analyze the provided dataset based on the user's request and generate a BI report with a title, a brief summary, and data formatted for a chart.

### Instructions:
1.  Analyze the data provided.
2.  Fulfill the user's request to generate insights.
3.  Create a concise 'title' for the report based on the request.
4.  Write a one-to-two sentence 'summary' of the key insight.
5.  Generate an array of 'chartData' suitable for a bar chart. Each item in the array should be an object with two keys: 'name' (for the x-axis label) and 'value' (for the y-axis numerical value).
6.  The 'value' field in chartData MUST be a number. Do not include strings, commas, or currency symbols.

### Dataset:
\`\`\`
{{{data}}}
\`\`\`

### User's Request:
"{{{request}}}"
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
    const output = await ai.run(biReportPrompt, input);

    if (!output) {
      throw new Error("The AI model did not return a valid BI report structure.");
    }
    
    // Ensure all chart values are numbers, as the model may sometimes return them as strings.
    const sanitizedChartData = output.chartData.map(d => {
        const numericValue = typeof d.value === 'string' 
            ? parseFloat(d.value.replace(/[^0-9.-]+/g,"")) 
            : d.value;
        
        return {
            ...d,
            value: isNaN(numericValue) ? 0 : numericValue,
        };
    });

    return {
        ...output,
        chartData: sanitizedChartData,
    };
  }
);
