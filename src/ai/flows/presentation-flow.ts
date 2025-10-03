'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 */
// import { ai } from '@/ai/genkit';
import {
  PresentationInputSchema,
  PresentationOutputSchema,
  type PresentationInput,
  type PresentationOutput,
} from '../schemas';

// const prompt = ai.definePrompt({
//   name: 'presentationPrompt',
//   input: { schema: PresentationInputSchema },
//   output: { schema: PresentationOutputSchema, format: 'json' },
//   prompt: `You are a presentation expert.
// Generate a slide deck outline based on the provided topic and instructions.
// Each slide should have a title and a few bullet points of content.

// Topic: {{{topic}}}
// Instructions: {{{instructions}}}`,
// });

export async function generatePresentation(
  input: PresentationInput
): Promise<PresentationOutput> {
  // const { output } = await prompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
