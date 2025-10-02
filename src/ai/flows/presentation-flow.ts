'use server';

import { ai } from '@/ai/genkit';
import { PresentationInputSchema, PresentationOutputSchema, type PresentationInput, type PresentationOutput } from '../schemas';

export async function generatePresentation(input: PresentationInput): Promise<PresentationOutput> {
  return generatePresentationFlow(input);
}

const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: PresentationInputSchema,
    outputSchema: PresentationOutputSchema,
  },
  async (input) => {

    const prompt = ai.definePrompt({
        name: 'presentationPrompt',
        input: { schema: PresentationInputSchema },
        output: { schema: PresentationOutputSchema, format: 'json' },
        prompt: `You are a presentation assistant. Create a series of slides for a presentation on the given topic.

        TOPIC: "${input.topic}"
        
        INSTRUCTIONS: "${input.instructions || 'Create a standard 5-slide presentation: Introduction, 3 key points, and a Conclusion.'}"

        For each slide, provide a clear 'title' and an array of 'content' bullet points.
        The response should be a JSON object containing an array of slide objects.
        `,
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a presentation.");
    }
    return output;
  }
);