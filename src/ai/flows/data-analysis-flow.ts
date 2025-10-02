'use server';

import { ai } from '@/ai/genkit';
import { DataAnalysisInputSchema, DataAnalysisOutputSchema, type DataAnalysisInput, type DataAnalysisOutput } from '../schemas';

export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
  return analyzeDataFlow(input);
}

const analyzeDataFlow = ai.defineFlow(
  {
    name: 'analyzeDataFlow',
    inputSchema: DataAnalysisInputSchema,
    outputSchema: DataAnalysisOutputSchema,
  },
  async (input) => {
    
    const prompt = ai.definePrompt({
        name: 'dataAnalysisPrompt',
        input: { schema: DataAnalysisInputSchema },
        output: { schema: DataAnalysisOutputSchema, format: 'json' },
        prompt: `You are a Data Analyst. Your task is to analyze the provided dataset and answer the user's question.

        - The dataset is provided in a string format (likely CSV or plain text).
        - The user's question is about this data.
        - Your response should include a text 'summary' answering the question, and optionally, a 'data' field containing a string representation of any resulting data (e.g., as a markdown table).

        DATASET:
        \`\`\`
        ${input.data}
        \`\`\`

        QUESTION: "${input.question}"

        Provide a clear, concise summary. If the question implies a tabular result, format the 'data' field as a markdown table.
        `,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to analyze data.");
    }
    return output;
  }
);