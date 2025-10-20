'use server';

// import {ai} from '@/ai/genkit';
// import {
//   PhotoBoothInputSchema,
//   type PhotoBoothInput,
//   PhotoBoothOutputSchema,
//   type PhotoBoothOutput,
// } from '../schemas';

// const photoBoothPrompt = ai.definePrompt({
//   name: 'photoBoothPrompt',
//   input: {schema: PhotoBoothInputSchema},
//   output: {schema: PhotoBoothOutputSchema},
//   prompt: `You are an AI photo editing expert. Transform the provided image into a new one based on the requested style.

// Style: {{style}}

// Image:
// {{media url=photoDataUri}}

// Generate a new image in the requested style and return it as a data URI.`,
// });

export async function runPhotoBooth(
  input: any
): Promise<any> {
  // const {output} = await photoBoothPrompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
