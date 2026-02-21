'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 *
 * - generatePresentation - A function that takes a topic and instructions and returns a presentation outline.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { PresentationInput, PresentationOutput } from '../schemas';

const PresentationInputSchema = z.object({
  topic: z.string().describe('The main topic of the presentation.'),
  instructions: z.string().optional().describe('Specific instructions for the outline.'),
});

const PresentationOutputSchema = z.object({
  slides: z.array(z.object({
    title: z.string().describe('The title of the slide.'),
    content: z.array(z.string()).describe('A list of bullet points for the slide content.'),
  })).describe('A list of slides for the presentation.'),
});

export async function generatePresentation(
  input: PresentationInput
): Promise<PresentationOutput> {
  return presentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'presentationPrompt',
  input: { schema: PresentationInputSchema },
  output: { schema: PresentationOutputSchema },
  prompt: `You are a professional presentation designer.
  
  Create a compelling slide-by-slide outline for a presentation on the following topic.
  
  Topic: {{{topic}}}
  {{#if instructions}}
  Instructions: {{{instructions}}}
  {{/if}}
  
  Provide exactly 5-7 slides. Each slide should have a clear title and 3-5 concise bullet points.`,
});

const presentationFlow = ai.defineFlow(
  {
    name: 'presentationFlow',
    inputSchema: PresentationInputSchema,
    outputSchema: PresentationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate presentation.');
    return output;
  }
);
