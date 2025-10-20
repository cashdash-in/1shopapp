'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 */
// import {ai} from '@/ai/genkit';
// import {
//   DataAnalysisInputSchema,
//   type DataAnalysisInput,
//   DataAnalysisOutputSchema,
//   type DataAnalysisOutput,
// } from '../schemas';

// const dataAnalysisPrompt = ai.definePrompt({
//   name: 'dataAnalysisPrompt',
//   input: {schema: DataAnalysisInputSchema},
//   output: {schema: DataAnalysisOutputSchema},
//   prompt: `You are an expert data analyst. Analyze the following data and answer the user's question.

// Data:
// \`\`\`
// {{data}}
// \`\`\`

// Question: {{question}}

// Provide a concise, text-based summary that directly answers the question. If the answer involves a subset or transformation of the data, also provide that data in a markdown table format in the 'data' field of the output.`,
// });

export async function analyzeData(
  input: any
): Promise<any> {
  // const {output} = await dataAnalysisPrompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
