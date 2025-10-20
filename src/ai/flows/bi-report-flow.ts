'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports.
 */

// import {ai} from '@/ai/genkit';
// import {
//   BiReportInputSchema,
//   type BiReportInput,
//   BiReportOutputSchema,
//   type BiReportOutput,
// } from '../schemas';

// const biReportPrompt = ai.definePrompt({
//   name: 'biReportPrompt',
//   input: {schema: BiReportInputSchema},
//   output: {schema: BiReportOutputSchema},
//   prompt: `You are a Business Intelligence analyst. Your task is to analyze the provided data and generate a report that fulfills the user's request.

// Data (CSV format):
// \`\`\`
// {{data}}
// \`\`\`

// User Request: "{{request}}"

// Your response must be a JSON object containing:
// 1.  'title': A descriptive title for the chart/report.
// 2.  'summary': A brief, one or two-sentence summary of the key insight from the data.
// 3.  'chartData': An array of objects, where each object has a 'name' (for the x-axis label) and a 'value' (for the y-axis numerical value), suitable for a bar chart.

// Analyze the data, process it to fit the request, and format it strictly according to the output schema.
// `,
// });

export async function generateBiReport(
  input: any
): Promise<any> {
  // const {output} = await biReportPrompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
