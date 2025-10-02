
'use server';
/**
 * @fileOverview An AI flow for generating presentation slides from a topic.
 * 
 * - generatePresentation - A function that takes a topic and returns a structured presentation outline.
 */

import { ai } from '@/ai/genkit';
import { PresentationInputSchema, PresentationOutputSchema, type PresentationInput, type PresentationOutput } from '../schemas';

// The main function that clients will call.
export async function generatePresentation(input: PresentationInput): Promise<PresentationOutput> {
  const result = await presentationFlow(input);
  return result;
}

// Define the prompt for the AI model
const presentationPrompt = ai.definePrompt({
  name: 'presentationPrompt',
  input: { schema: PresentationInputSchema },
  output: { schema: PresentationOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert presentation creator. Your task is to generate a slide deck based on a given topic.

Topic: {{{topic}}}

{{#if instructions}}
Specific Instructions: {{{instructions}}}
{{/if}}

Please generate a series of slides. For each slide, provide a concise title and a list of bullet points for the content.
Ensure the output is in JSON format, with an array of slides, where each slide is an object with "title" and "content" (as an array of strings).
`,
});

// Define the Genkit flow
const presentationFlow = ai.defineFlow(
  {
    name: 'presentationFlow',
    inputSchema: PresentationInputSchema,
    outputSchema: PresentationOutputSchema,
  },
  async (input) => {
    const { output } = await presentationPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid presentation structure.");
    }
    return output;
  }
);
