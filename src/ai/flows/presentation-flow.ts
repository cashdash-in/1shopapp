'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 */
// import {ai} from '@/ai/genkit';
// import {
//   PresentationInputSchema,
//   type PresentationInput,
//   PresentationOutputSchema,
//   type PresentationOutput,
// } from '../schemas';

// const presentationPrompt = ai.definePrompt({
//   name: 'presentationPrompt',
//   input: {schema: PresentationInputSchema},
//   output: {schema: PresentationOutputSchema},
//   prompt: `Generate a slide-by-slide outline for a presentation.

// Topic: {{topic}}

// Specific Instructions: {{instructions}}

// For each slide, provide a clear title and 3-5 bullet points for the content. The output must be a JSON object that follows the PresentationOutput schema.`,
// });

export async function generatePresentation(
  input: any
): Promise<any> {
  // const {output} = await presentationPrompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
