
'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 */

import { ai } from '@/ai/genkit';
import {
  PresentationInputSchema,
  PresentationOutputSchema,
  type PresentationInput,
  type PresentationOutput,
} from '../schemas';

const presentationPrompt = ai.definePrompt({
    name: 'presentationPrompt',
    input: { schema: PresentationInputSchema },
    output: { schema: PresentationOutputSchema },
    prompt: `
    You are a presentation expert. Your task is to create a slide deck outline based on a given topic and optional instructions.
    For each slide, provide a clear title and a list of 3-5 concise bullet points.

    Topic: {{{topic}}}
    {{#if instructions}}
    Instructions: {{{instructions}}}
    {{/if}}

    Generate the presentation content.
    `,
});

const presentationFlow = ai.defineFlow(
  {
    name: 'presentationFlow',
    inputSchema: PresentationInputSchema,
    outputSchema: PresentationOutputSchema,
  },
  async (input) => {
    const { output } = await presentationPrompt(input);
    return output!;
  }
);

export async function generatePresentation(input: PresentationInput): Promise<PresentationOutput> {
    return presentationFlow(input);
}
